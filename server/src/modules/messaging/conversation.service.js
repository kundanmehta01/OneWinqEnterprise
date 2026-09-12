import { Conversation } from './conversation.model.js';
import { Message } from './message.model.js';
import { Connection } from '../connections/connection.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { User } from '../users/user.model.js';
import { NotFoundError, ForbiddenError, BadRequestError, ConflictError } from '../../errors/index.js';
import { logger } from '../../config/logger.config.js';

class ConversationService {
  /**
   * Get or create a direct (1:1) conversation between two users.
   * Validates that an accepted Connection exists between them.
   */
  async getOrCreateDirectConversation(userId, targetUserId, companyId) {
    if (userId.toString() === targetUserId.toString()) {
      throw new BadRequestError('Cannot start a conversation with yourself');
    }

    // Ensure a valid accepted connection exists
    const connection = await Connection.findOne({
      $or: [
        { requesterId: userId, recipientId: targetUserId, status: 'accepted' },
        { requesterId: targetUserId, recipientId: userId, status: 'accepted' }
      ]
    });

    if (!connection) {
      throw new ForbiddenError('You can only message users you are connected with');
    }

    // Look for existing direct conversation between these two
    const existing = await Conversation.findOne({
      type: 'direct',
      companyId,
      isActive: true,
      'participants.userId': { $all: [userId, targetUserId] },
      $expr: { $eq: [{ $size: '$participants' }, 2] }
    });

    if (existing) {
      const populatedExisting = await Conversation.findById(existing._id)
        .populate('participants.userId', 'name email avatarUrl designation')
        .populate('createdBy', 'name email avatarUrl designation')
        .lean();
      return populatedExisting || existing;
    }

    // Create new direct conversation
    const conversation = await Conversation.create({
      type: 'direct',
      companyId,
      participants: [
        { userId, role: 'member', joinedAt: new Date() },
        { userId: targetUserId, role: 'member', joinedAt: new Date() }
      ],
      createdBy: userId
    });

    const populatedNew = await Conversation.findById(conversation._id)
      .populate('participants.userId', 'name email avatarUrl designation')
      .populate('createdBy', 'name email avatarUrl designation')
      .lean();

    return populatedNew || conversation;
  }

  /**
   * Create a new group conversation within an org.
   */
  async createGroupConversation({ name, description = '', participantIds = [], createdBy, companyId }) {
    if (!name || name.trim().length === 0) {
      throw new BadRequestError('Group name is required');
    }

    // Deduplicate and always include the creator
    const uniqueIds = [...new Set([createdBy.toString(), ...participantIds.map((id) => id.toString())])];

    if (uniqueIds.length < 2) {
      throw new BadRequestError('A group must have at least 2 members');
    }

    // Verify all participants exist and are active
    const [memberCount, userCount] = await Promise.all([
      TeamMember.countDocuments({
        userId: { $in: uniqueIds },
        status: { $ne: 'archived' }
      }),
      User.countDocuments({
        _id: { $in: uniqueIds },
        status: { $ne: 'deleted' }
      })
    ]);

    if (memberCount < uniqueIds.length && userCount < uniqueIds.length) {
      throw new BadRequestError('One or more participants do not belong to this organization');
    }

    const participants = uniqueIds.map((uid) => ({
      userId: uid,
      role: uid === createdBy.toString() ? 'admin' : 'member',
      joinedAt: new Date()
    }));

    const conversation = await Conversation.create({
      type: 'group',
      companyId,
      name: name.trim(),
      description: description.trim(),
      participants,
      createdBy
    });

    const populatedGroup = await Conversation.findById(conversation._id)
      .populate('participants.userId', 'name email avatarUrl designation')
      .populate('createdBy', 'name email avatarUrl designation')
      .lean();

    return populatedGroup || conversation;
  }

  /**
   * List all conversations for a user, sorted by lastMessage.sentAt desc.
   */
  async getUserConversations(userId, companyId, query = {}) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter = {
      companyId,
      isActive: true,
      'participants.userId': userId
    };

    const [conversations, totalItems] = await Promise.all([
      Conversation.find(filter)
        .sort({ 'lastMessage.sentAt': -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('participants.userId', 'name email avatarUrl designation')
        .populate('createdBy', 'name email avatarUrl designation')
        .lean(),
      Conversation.countDocuments(filter)
    ]);

    return { conversations, totalItems, page, limit };
  }

  /**
   * Get a single conversation by ID, with membership check.
   */
  async getConversationById(conversationId, userId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      isActive: true,
      'participants.userId': userId
    })
      .populate('participants.userId', 'name email avatarUrl designation')
      .populate('createdBy', 'name email avatarUrl designation')
      .lean();

    if (!conversation) {
      throw new NotFoundError('Conversation not found or you are not a member');
    }

    return conversation;
  }

  /**
   * Add a participant to a group conversation (admin only).
   */
  async addParticipant(conversationId, newUserId, actorId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      type: 'group',
      isActive: true
    });

    if (!conversation) throw new NotFoundError('Group conversation not found');

    const actor = conversation.participants.find((p) => p.userId.toString() === actorId.toString());
    if (!actor || actor.role !== 'admin') {
      throw new ForbiddenError('Only group admins can add members');
    }

    const alreadyMember = conversation.participants.some((p) => p.userId.toString() === newUserId.toString());
    if (alreadyMember) throw new ConflictError('User is already a member of this group');

    conversation.participants.push({ userId: newUserId, role: 'member', joinedAt: new Date() });
    await conversation.save();

    return conversation;
  }

  /**
   * Remove a participant from a group (admin or self-leave).
   */
  async removeParticipant(conversationId, targetUserId, actorId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      type: 'group',
      isActive: true
    });

    if (!conversation) throw new NotFoundError('Group conversation not found');

    const isSelf = actorId.toString() === targetUserId.toString();
    const actor = conversation.participants.find((p) => p.userId.toString() === actorId.toString());

    if (!isSelf && (!actor || actor.role !== 'admin')) {
      throw new ForbiddenError('Only group admins can remove other members');
    }

    const idx = conversation.participants.findIndex((p) => p.userId.toString() === targetUserId.toString());
    if (idx === -1) throw new NotFoundError('User is not a member of this group');

    conversation.participants.splice(idx, 1);

    // If no members left, mark inactive
    if (conversation.participants.length === 0) {
      conversation.isActive = false;
    }

    await conversation.save();
    return conversation;
  }

  /**
   * Update group name/avatar (admin only).
   */
  async updateGroupInfo(conversationId, { name, description, avatarUrl }, actorId) {
    const conversation = await Conversation.findOne({
      _id: conversationId,
      type: 'group',
      isActive: true
    });

    if (!conversation) throw new NotFoundError('Group conversation not found');

    const actor = conversation.participants.find((p) => p.userId.toString() === actorId.toString());
    if (!actor || actor.role !== 'admin') {
      throw new ForbiddenError('Only group admins can update group info');
    }

    if (name !== undefined) conversation.name = name.trim();
    if (description !== undefined) conversation.description = description.trim();
    if (avatarUrl !== undefined) conversation.avatarUrl = avatarUrl;

    await conversation.save();
    return conversation;
  }

  /**
   * Update lastMessage snapshot on conversation (called after a message is sent).
   */
  async updateLastMessage(conversationId, { senderId, content, contentType, sentAt }) {
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: { senderId, content, contentType, sentAt }
    });
  }
}

export const conversationService = new ConversationService();
