import { Connection } from './connection.model.js';
import { User } from '../users/user.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
import { notificationService } from '../notifications/notification.service.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../errors/index.js';

class ConnectionService {
  async getPeopleDirectory(currentUserId, query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 12);
    const filter = {
      userId: { $ne: currentUserId },
      status: 'active'
    };

    if (query.departmentId) {
      filter.departmentId = query.departmentId;
    }
    if (query.designation) {
      filter.designation = { $regex: query.designation, $options: 'i' };
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { designation: { $regex: query.search, $options: 'i' } }
      ];
    }

    const [members, totalItems] = await Promise.all([
      TeamMember.find(filter)
        .populate('departmentId', 'name')
        .populate('profileId', 'slug published.avatarUrl published.headline published.skills published.location published.bio')
        .sort(sort || { name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TeamMember.countDocuments(filter)
    ]);

    // Fetch all existing connections for current user to determine connection state
    const userIds = members.map((m) => m.userId);
    const existingConnections = await Connection.find({
      $or: [
        { requesterId: currentUserId, recipientId: { $in: userIds } },
        { recipientId: currentUserId, requesterId: { $in: userIds } }
      ]
    }).lean();

    const connectionMap = new Map();
    existingConnections.forEach((conn) => {
      const otherId = conn.requesterId.toString() === currentUserId.toString()
        ? conn.recipientId.toString()
        : conn.requesterId.toString();

      let state = 'none';
      if (conn.status === 'accepted') {
        state = 'connected';
      } else if (conn.status === 'pending') {
        state = conn.requesterId.toString() === currentUserId.toString() ? 'pending_sent' : 'pending_received';
      } else if (conn.status === 'declined') {
        state = 'declined';
      }

      connectionMap.set(otherId, { state, connectionId: conn._id });
    });

    const enrichedMembers = members.map((m) => {
      const connInfo = connectionMap.get(m.userId.toString()) || { state: 'none', connectionId: null };
      return {
        _id: m._id,
        userId: m.userId,
        employeeId: m.employeeId,
        name: m.name,
        designation: m.designation,
        department: m.departmentId?.name || '',
        departmentId: m.departmentId?._id || null,
        slug: m.profileId?.slug || '',
        avatarUrl: m.profileId?.published?.avatarUrl || '',
        headline: m.profileId?.published?.headline || '',
        skills: m.profileId?.published?.skills || [],
        location: m.profileId?.published?.location || '',
        connectionStatus: connInfo.state,
        connectionId: connInfo.connectionId
      };
    });

    // Optional skill filter in memory if provided
    let finalResults = enrichedMembers;
    if (query.skills) {
      const skillRegex = new RegExp(query.skills, 'i');
      finalResults = enrichedMembers.filter((m) =>
        m.skills.some((s) => (typeof s === 'string' ? skillRegex.test(s) : skillRegex.test(s.name)))
      );
    }

    return {
      people: finalResults,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async sendConnectionRequest(requesterId, { recipientId, note = '' }) {
    if (requesterId.toString() === recipientId.toString()) {
      throw new BadRequestError('You cannot send a connection request to yourself.');
    }

    const recipient = await User.findById(recipientId);
    if (!recipient || recipient.status !== 'active') {
      throw new NotFoundError('Recipient user not found or inactive.');
    }

    // Check existing connection
    const existing = await Connection.findOne({
      $or: [
        { requesterId, recipientId },
        { requesterId: recipientId, recipientId: requesterId }
      ]
    });

    if (existing) {
      if (existing.status === 'accepted') {
        throw new ConflictError('You are already connected with this user.');
      }
      if (existing.status === 'pending') {
        throw new ConflictError('A pending connection request already exists between you.');
      }
      if (existing.status === 'declined') {
        // Re-open request
        existing.requesterId = requesterId;
        existing.recipientId = recipientId;
        existing.note = note;
        existing.status = 'pending';
        existing.connectedAt = null;
        await existing.save();

        this._emitAndNotifyRequest(existing, requesterId, recipientId);
        return existing;
      }
    }

    const connection = await Connection.create({
      requesterId,
      recipientId,
      note,
      status: 'pending'
    });

    this._emitAndNotifyRequest(connection, requesterId, recipientId);

    return connection;
  }

  async _emitAndNotifyRequest(connection, requesterId, recipientId) {
    const requesterMember = await TeamMember.findOne({ userId: requesterId }).lean();
    const requesterName = requesterMember ? requesterMember.name : 'A colleague';

    await notificationService.createNotification({
      recipientId,
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${requesterName} sent you a connection request.`,
      data: {
        connectionId: connection._id,
        requesterId,
        requesterName
      }
    });

    eventBus.emitEvent(APP_EVENTS.CONNECTION_REQUESTED, {
      connectionId: connection._id,
      requesterId,
      recipientId
    });
  }

  async acceptConnectionRequest(connectionId, recipientId) {
    const connection = await Connection.findOne({
      _id: connectionId,
      recipientId,
      status: 'pending'
    });

    if (!connection) {
      throw new NotFoundError('Pending connection request not found.');
    }

    connection.status = 'accepted';
    connection.connectedAt = new Date();
    await connection.save();

    const recipientMember = await TeamMember.findOne({ userId: recipientId }).lean();
    const recipientName = recipientMember ? recipientMember.name : 'Your colleague';

    await notificationService.createNotification({
      recipientId: connection.requesterId,
      type: 'connection_accepted',
      title: 'Connection Accepted',
      message: `${recipientName} accepted your connection request.`,
      data: {
        connectionId: connection._id,
        connectedUserId: recipientId,
        connectedUserName: recipientName
      }
    });

    eventBus.emitEvent(APP_EVENTS.CONNECTION_ACCEPTED, {
      connectionId: connection._id,
      requesterId: connection.requesterId,
      recipientId
    });

    return connection;
  }

  async declineConnectionRequest(connectionId, recipientId) {
    const connection = await Connection.findOne({
      _id: connectionId,
      recipientId,
      status: 'pending'
    });

    if (!connection) {
      throw new NotFoundError('Pending connection request not found.');
    }

    connection.status = 'declined';
    await connection.save();

    eventBus.emitEvent(APP_EVENTS.CONNECTION_DECLINED, {
      connectionId: connection._id,
      requesterId: connection.requesterId,
      recipientId
    });

    return { message: 'Connection request declined.' };
  }

  async cancelConnectionRequest(connectionId, requesterId) {
    const connection = await Connection.findOneAndDelete({
      _id: connectionId,
      requesterId,
      status: 'pending'
    });

    if (!connection) {
      throw new NotFoundError('Pending sent connection request not found.');
    }

    return { message: 'Connection request cancelled.' };
  }

  async getMyConnections(userId, query = {}) {
    const { page, limit, skip } = parsePagination(query, 15);

    const filter = {
      $or: [{ requesterId: userId }, { recipientId: userId }],
      status: 'accepted'
    };

    const [connections, totalItems] = await Promise.all([
      Connection.find(filter)
        .sort({ connectedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Connection.countDocuments(filter)
    ]);

    const otherUserIds = connections.map((c) =>
      c.requesterId.toString() === userId.toString() ? c.recipientId : c.requesterId
    );

    const members = await TeamMember.find({ userId: { $in: otherUserIds } })
      .populate('departmentId', 'name')
      .populate('profileId', 'slug published.avatarUrl published.headline published.socialLinks')
      .lean();

    const memberMap = new Map(members.map((m) => [m.userId.toString(), m]));

    const result = connections.map((conn) => {
      const otherId = conn.requesterId.toString() === userId.toString()
        ? conn.recipientId.toString()
        : conn.requesterId.toString();

      const member = memberMap.get(otherId);

      return {
        connectionId: conn._id,
        connectedAt: conn.connectedAt,
        user: member ? {
          userId: member.userId,
          name: member.name,
          designation: member.designation,
          department: member.departmentId?.name || '',
          slug: member.profileId?.slug || '',
          avatarUrl: member.profileId?.published?.avatarUrl || '',
          headline: member.profileId?.published?.headline || ''
        } : null
      };
    }).filter((c) => c.user !== null);

    return {
      connections: result,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async removeConnection(connectionId, userId) {
    const connection = await Connection.findOneAndDelete({
      _id: connectionId,
      $or: [{ requesterId: userId }, { recipientId: userId }],
      status: 'accepted'
    });

    if (!connection) {
      throw new NotFoundError('Active connection not found.');
    }

    eventBus.emitEvent(APP_EVENTS.CONNECTION_REMOVED, {
      connectionId,
      userId
    });

    return { message: 'Connection removed successfully.' };
  }

  async getIncomingRequests(userId, query = {}) {
    const { page, limit, skip } = parsePagination(query, 10);
    const filter = { recipientId: userId, status: 'pending' };

    const [requests, totalItems] = await Promise.all([
      Connection.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Connection.countDocuments(filter)
    ]);

    const requesterUserIds = requests.map((r) => r.requesterId);
    const members = await TeamMember.find({ userId: { $in: requesterUserIds } })
      .populate('departmentId', 'name')
      .populate('profileId', 'slug published.avatarUrl published.headline')
      .lean();

    const memberMap = new Map(members.map((m) => [m.userId.toString(), m]));

    const formattedRequests = requests.map((r) => {
      const m = memberMap.get(r.requesterId.toString());
      return {
        requestId: r._id,
        note: r.note,
        createdAt: r.createdAt,
        requester: m ? {
          userId: m.userId,
          name: m.name,
          designation: m.designation,
          department: m.departmentId?.name || '',
          slug: m.profileId?.slug || '',
          avatarUrl: m.profileId?.published?.avatarUrl || '',
          headline: m.profileId?.published?.headline || ''
        } : null
      };
    });

    return {
      requests: formattedRequests,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async getOutgoingRequests(userId, query = {}) {
    const { page, limit, skip } = parsePagination(query, 10);
    const filter = { requesterId: userId, status: 'pending' };

    const [requests, totalItems] = await Promise.all([
      Connection.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Connection.countDocuments(filter)
    ]);

    const recipientUserIds = requests.map((r) => r.recipientId);
    const members = await TeamMember.find({ userId: { $in: recipientUserIds } })
      .populate('departmentId', 'name')
      .populate('profileId', 'slug published.avatarUrl published.headline')
      .lean();

    const memberMap = new Map(members.map((m) => [m.userId.toString(), m]));

    const formattedRequests = requests.map((r) => {
      const m = memberMap.get(r.recipientId.toString());
      return {
        requestId: r._id,
        note: r.note,
        createdAt: r.createdAt,
        recipient: m ? {
          userId: m.userId,
          name: m.name,
          designation: m.designation,
          department: m.departmentId?.name || '',
          slug: m.profileId?.slug || '',
          avatarUrl: m.profileId?.published?.avatarUrl || '',
          headline: m.profileId?.published?.headline || ''
        } : null
      };
    });

    return {
      requests: formattedRequests,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }
}

export const connectionService = new ConnectionService();
