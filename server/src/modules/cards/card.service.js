import crypto from 'crypto';
import { Card } from './card.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
import { User } from '../users/user.model.js';
import { analyticsService } from '../analytics/analytics.service.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from '../../errors/index.js';

class CardService {
  _hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  _generateSecureToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  async getAllCards(query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 15);
    const filter = {};

    if (query.status && query.status !== 'all') {
      if (query.status === 'active') {
        filter.status = { $in: ['active', 'linked'] };
      } else if (query.status === 'available') {
        filter.status = { $in: ['available', 'unassigned'] };
      } else if (query.status === 'suspended') {
        filter.status = { $in: ['suspended', 'blocked'] };
      } else if (query.status === 'deactivated') {
        filter.status = { $in: ['deactivated', 'lost', 'retired'] };
      } else {
        filter.status = query.status;
      }
    }

    if (query.cardType && query.cardType !== 'all') {
      filter.cardType = query.cardType;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      const matchingMembers = await TeamMember.find({
        $or: [{ name: searchRegex }, { employeeId: searchRegex }, { email: searchRegex }]
      }).select('_id');

      const memberIds = matchingMembers.map((m) => m._id);

      filter.$or = [
        { cardUid: searchRegex },
        { serialNumber: searchRegex },
        { batchNumber: searchRegex },
        { memberId: { $in: memberIds } }
      ];
    }

    const [cards, totalItems] = await Promise.all([
      Card.find(filter)
        .populate({
          path: 'memberId',
          select: 'name designation employeeId departmentId status email userId',
          populate: { path: 'departmentId', select: 'name' }
        })
        .populate({
          path: 'profileId',
          select: 'slug published.avatarUrl'
        })
        .populate('assignedBy', 'email')
        .populate('activatedBy', 'email')
        .populate('linkedBy', 'email')
        .populate('unlinkedBy', 'email')
        .sort(sort || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Card.countDocuments(filter)
    ]);

    const formattedCards = cards.map((c) => {
      // Normalize legacy statuses to new lifecycle
      let normalizedStatus = c.status;
      if (c.status === 'unassigned') normalizedStatus = 'available';
      if (c.status === 'linked') normalizedStatus = 'active';
      if (c.status === 'blocked') normalizedStatus = 'suspended';
      if (c.status === 'lost' || c.status === 'retired') normalizedStatus = 'deactivated';

      return {
        _id: c._id,
        cardUid: c.cardUid,
        serialNumber: c.serialNumber,
        cardType: c.cardType,
        batchNumber: c.batchNumber,
        status: normalizedStatus,
        rawStatus: c.status,
        tapCount: c.tapCount || 0,
        lastTappedAt: c.lastTappedAt,
        assignedAt: c.assignedAt,
        assignedBy: c.assignedBy ? c.assignedBy.email : null,
        activatedAt: c.activatedAt,
        activatedBy: c.activatedBy ? c.activatedBy.email : null,
        linkedAt: c.linkedAt,
        linkedBy: c.linkedBy ? c.linkedBy.email : null,
        unlinkedAt: c.unlinkedAt,
        unlinkedBy: c.unlinkedBy ? c.unlinkedBy.email : null,
        hasPendingActivation: Boolean(c.activationTokenHash && normalizedStatus === 'activation_pending'),
        activationExpiresAt: c.activationTokenExpiresAt,
        notes: c.notes,
        createdAt: c.createdAt,
        member: c.memberId
          ? {
              _id: c.memberId._id,
              userId: c.memberId.userId,
              name: c.memberId.name,
              email: c.memberId.email,
              designation: c.memberId.designation,
              employeeId: c.memberId.employeeId,
              department: c.memberId.departmentId?.name || '',
              status: c.memberId.status
            }
          : null,
        profile: c.profileId
          ? {
              _id: c.profileId._id,
              slug: c.profileId.slug,
              avatarUrl: c.profileId.published?.avatarUrl || ''
            }
          : null
      };
    });

    return {
      cards: formattedCards,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async getCardStats() {
    const [
      totalCards,
      availableCards,
      pendingCards,
      activeCards,
      suspendedCards,
      deactivatedCards,
      tapStats,
      byType
    ] = await Promise.all([
      Card.countDocuments(),
      Card.countDocuments({ status: { $in: ['available', 'unassigned'] } }),
      Card.countDocuments({ status: 'activation_pending' }),
      Card.countDocuments({ status: { $in: ['active', 'linked'] } }),
      Card.countDocuments({ status: { $in: ['suspended', 'blocked'] } }),
      Card.countDocuments({ status: { $in: ['deactivated', 'lost', 'retired'] } }),
      Card.aggregate([{ $group: { _id: null, totalTaps: { $sum: '$tapCount' } } }]),
      Card.aggregate([{ $group: { _id: '$cardType', count: { $sum: 1 } } }])
    ]);

    const typeBreakdown = {};
    byType.forEach((b) => {
      typeBreakdown[b._id] = b.count;
    });

    return {
      totalCards,
      availableCards,
      pendingCards,
      activeCards,
      suspendedCards,
      deactivatedCards,
      total: totalCards,
      available: availableCards,
      pending: pendingCards,
      active: activeCards,
      suspended: suspendedCards,
      deactivated: deactivatedCards,
      totalTaps: tapStats[0]?.totalTaps || 0,
      typeBreakdown
    };
  }

  async getCardById(id) {
    const card = await Card.findById(id)
      .populate({
        path: 'memberId',
        select: 'name designation employeeId departmentId status email userId joiningDate',
        populate: { path: 'departmentId', select: 'name' }
      })
      .populate({
        path: 'profileId',
        select: 'slug templateId published.avatarUrl published.headline visibility'
      })
      .populate('assignedBy', 'email')
      .populate('activatedBy', 'email')
      .populate('linkedBy', 'email')
      .populate('unlinkedBy', 'email')
      .lean();

    if (!card) {
      throw new NotFoundError('Card not found.');
    }

    let normalizedStatus = card.status;
    if (card.status === 'unassigned') normalizedStatus = 'available';
    if (card.status === 'linked') normalizedStatus = 'active';
    if (card.status === 'blocked') normalizedStatus = 'suspended';
    if (card.status === 'lost' || card.status === 'retired') normalizedStatus = 'deactivated';

    return {
      ...card,
      status: normalizedStatus,
      rawStatus: card.status
    };
  }

  async createCard(data, actorId) {
    const normalizedUid = data.cardUid.toUpperCase().trim();
    const normalizedSerial = data.serialNumber.toUpperCase().trim();

    const existing = await Card.findOne({
      $or: [{ cardUid: normalizedUid }, { serialNumber: normalizedSerial }]
    });

    if (existing) {
      if (existing.cardUid === normalizedUid) {
        throw new ConflictError(`A card with UID "${normalizedUid}" already exists in inventory.`);
      }
      throw new ConflictError(`A card with Serial Number "${normalizedSerial}" already exists in inventory.`);
    }

    const card = await Card.create({
      ...data,
      cardUid: normalizedUid,
      serialNumber: normalizedSerial,
      status: 'available',
      memberId: null,
      profileId: null,
      activationTokenHash: null,
      activationTokenExpiresAt: null
    });

    eventBus.emitEvent(APP_EVENTS.CARD_CREATED, {
      cardId: card._id,
      cardUid: card.cardUid,
      serialNumber: card.serialNumber,
      actorId
    });

    return card;
  }

  async createBulkCards(cardsList, actorId) {
    const uids = cardsList.map((c) => c.cardUid.toUpperCase().trim());
    const serials = cardsList.map((c) => c.serialNumber.toUpperCase().trim());

    if (new Set(uids).size !== uids.length) {
      throw new BadRequestError('Duplicate Card UIDs detected in bulk payload.');
    }
    if (new Set(serials).size !== serials.length) {
      throw new BadRequestError('Duplicate Serial Numbers detected in bulk payload.');
    }

    const existing = await Card.find({
      $or: [{ cardUid: { $in: uids } }, { serialNumber: { $in: serials } }]
    }).select('cardUid serialNumber');

    if (existing.length > 0) {
      const existingUids = existing.map((e) => e.cardUid).join(', ');
      throw new ConflictError(`The following cards already exist in inventory: ${existingUids}`);
    }

    const cardsToInsert = cardsList.map((c) => ({
      ...c,
      cardUid: c.cardUid.toUpperCase().trim(),
      serialNumber: c.serialNumber.toUpperCase().trim(),
      status: 'available',
      memberId: null,
      profileId: null,
      activationTokenHash: null,
      activationTokenExpiresAt: null
    }));

    const inserted = await Card.insertMany(cardsToInsert);

    eventBus.emitEvent(APP_EVENTS.CARD_CREATED, {
      count: inserted.length,
      actorId
    });

    return {
      message: `Successfully registered ${inserted.length} cards into inventory.`,
      cards: inserted,
      insertedCount: inserted.length
    };
  }

  async assignCard({ cardId, cardUid, memberId, employeeId, notes }, actorContext = {}) {
    // 1. Resolve Card
    let cardQuery = {};
    if (cardId) cardQuery._id = cardId;
    else if (cardUid) cardQuery.cardUid = cardUid.toUpperCase().trim();

    const card = await Card.findOne(cardQuery);
    if (!card) {
      throw new NotFoundError('Card not found in inventory.');
    }

    if (card.status === 'suspended' || card.status === 'blocked' || card.status === 'deactivated' || card.status === 'lost') {
      throw new BadRequestError(`Cannot assign a card that is "${card.status}". Please reactivate or unblock it first.`);
    }

    // 2. Resolve Member
    let memberQuery = {};
    if (memberId) memberQuery._id = memberId;
    else if (employeeId) memberQuery.employeeId = employeeId.toUpperCase().trim();

    const member = await TeamMember.findOne(memberQuery);
    if (!member) {
      throw new NotFoundError('Team member not found.');
    }

    if (member.status === 'deleted' || member.status === 'archived') {
      throw new BadRequestError('Cannot assign card to an inactive/archived team member.');
    }

    // 3. Resolve EmployeeProfile
    let profile = null;
    if (member.profileId) {
      profile = await EmployeeProfile.findById(member.profileId);
    }
    if (!profile) {
      profile = await EmployeeProfile.findOne({ memberId: member._id });
    }

    // 4. Generate single-use secure crypto activation token
    const rawToken = this._generateSecureToken();
    const tokenHash = this._hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days expiry

    const previousValue = card.toObject();

    // 5. Update Card to ACTIVATION PENDING
    card.status = 'activation_pending';
    card.memberId = member._id;
    card.profileId = profile ? profile._id : null;
    card.activationTokenHash = tokenHash;
    card.activationTokenExpiresAt = expiresAt;
    card.assignedAt = new Date();
    card.assignedBy = actorContext.actorId;
    card.activatedAt = null;
    card.activatedBy = null;
    if (notes !== undefined) card.notes = notes;

    await card.save();

    eventBus.emitEvent(APP_EVENTS.CARD_ASSIGNED, {
      cardId: card._id,
      cardUid: card.cardUid,
      serialNumber: card.serialNumber,
      memberId: member._id,
      memberName: member.name,
      actorId: actorContext.actorId,
      previousValue,
      newValue: card.toObject()
    });

    const populatedCard = await this.getCardById(card._id);

    return {
      message: `Card ${card.cardUid} successfully assigned to ${member.name}. Activation pending.`,
      card: populatedCard,
      rawToken,
      activationUrl: `/card/activate/${rawToken}`,
      expiresAt
    };
  }

  async getActivationDetails(rawToken) {
    if (!rawToken || typeof rawToken !== 'string') {
      throw new BadRequestError('Invalid activation token format.');
    }

    const tokenHash = this._hashToken(rawToken.trim());
    const card = await Card.findOne({
      activationTokenHash: tokenHash,
      activationTokenExpiresAt: { $gt: new Date() }
    })
      .populate({
        path: 'memberId',
        select: 'name designation employeeId departmentId status email userId',
        populate: { path: 'departmentId', select: 'name' }
      })
      .lean();

    if (!card) {
      throw new NotFoundError('Invalid, expired, or already used activation link.');
    }

    if (card.status !== 'activation_pending') {
      if (card.status === 'active' || card.status === 'linked') {
        throw new BadRequestError('This card has already been activated.');
      }
      throw new BadRequestError(`This card is in "${card.status}" state and cannot be activated.`);
    }

    const member = card.memberId;
    if (!member) {
      throw new BadRequestError('No team member is assigned to this card.');
    }

    // Mask email for security
    const email = member.email || '';
    const maskedEmail = email
      ? email.replace(/^(.)(.*)(@.*)$/, (_, first, middle, domain) => `${first}${'*'.repeat(Math.min(middle.length, 5))}${domain}`)
      : '';

    return {
      cardUid: card.cardUid,
      serialNumber: card.serialNumber,
      cardType: card.cardType,
      status: card.status,
      expiresAt: card.activationTokenExpiresAt,
      assignedTo: {
        memberId: member._id,
        userId: member.userId,
        name: member.name,
        designation: member.designation || 'Team Member',
        employeeId: member.employeeId,
        department: member.departmentId?.name || '',
        maskedEmail
      },
      organization: 'OneWinq Enterprise'
    };
  }

  async activateCard(rawToken, actorContext = {}) {
    if (!rawToken || typeof rawToken !== 'string') {
      throw new BadRequestError('Invalid activation token.');
    }

    const tokenHash = this._hashToken(rawToken.trim());
    const card = await Card.findOne({ activationTokenHash: tokenHash });

    if (!card) {
      throw new NotFoundError('Invalid or already used activation token.');
    }

    if (card.activationTokenExpiresAt && card.activationTokenExpiresAt < new Date()) {
      throw new BadRequestError('Activation token has expired. Please request a new link from your admin.');
    }

    if (card.status === 'active' || card.status === 'linked') {
      throw new BadRequestError('This card is already active.');
    }

    if (card.status !== 'activation_pending') {
      throw new BadRequestError(`Card cannot be activated from status "${card.status}".`);
    }

    if (!card.memberId) {
      throw new BadRequestError('Card has no assigned team member.');
    }

    // 1. Strict Ownership Enforcement
    const member = await TeamMember.findById(card.memberId);
    if (!member) {
      throw new NotFoundError('Assigned team member profile not found.');
    }

    const actorUserId = actorContext.actorId ? String(actorContext.actorId) : null;
    const memberUserId = member.userId ? String(member.userId) : null;
    const actorEmail = actorContext.user?.email ? actorContext.user.email.toLowerCase().trim() : null;
    const memberEmail = member.email ? member.email.toLowerCase().trim() : null;

    let isAuthorized = false;
    if (actorUserId && memberUserId && actorUserId === memberUserId) {
      isAuthorized = true;
    } else if (actorEmail && memberEmail && actorEmail === memberEmail) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new ForbiddenError(
        `This card is reserved for ${member.name}. You can only activate cards assigned to your own account.`
      );
    }

    // 2. Resolve or ensure Employee Profile
    let profile = null;
    if (member.profileId) {
      profile = await EmployeeProfile.findById(member.profileId);
    }
    if (!profile) {
      profile = await EmployeeProfile.findOne({ memberId: member._id });
    }
    if (!profile && actorUserId) {
      profile = await EmployeeProfile.findOne({ userId: actorUserId });
    }

    const previousValue = card.toObject();

    // 3. Complete Activation
    card.status = 'active';
    card.activatedAt = new Date();
    card.activatedBy = actorContext.actorId;
    card.linkedAt = new Date();
    card.linkedBy = actorContext.actorId;
    card.profileId = profile ? profile._id : card.profileId;
    card.activationTokenHash = null;
    card.activationTokenExpiresAt = null;

    await card.save();

    eventBus.emitEvent(APP_EVENTS.CARD_ACTIVATED, {
      cardId: card._id,
      cardUid: card.cardUid,
      serialNumber: card.serialNumber,
      memberId: member._id,
      memberName: member.name,
      actorId: actorContext.actorId,
      previousValue,
      newValue: card.toObject()
    });

    return {
      message: 'Your NFC card is active and linked to your profile.',
      card: {
        _id: card._id,
        cardUid: card.cardUid,
        serialNumber: card.serialNumber,
        cardType: card.cardType,
        status: 'active',
        activatedAt: card.activatedAt,
        profileSlug: profile?.slug || ''
      }
    };
  }

  async unassignCard({ cardId, memberId, reason }, actorContext = {}) {
    let query = {};
    if (cardId) query._id = cardId;
    else if (memberId) query.memberId = memberId;

    const card = await Card.findOne(query);
    if (!card) {
      throw new NotFoundError('Card not found.');
    }

    if (card.status === 'available' && !card.memberId) {
      throw new BadRequestError('This card is already available and unassigned.');
    }

    const previousValue = card.toObject();
    const oldMemberId = card.memberId;

    card.status = 'available';
    card.memberId = null;
    card.profileId = null;
    card.activationTokenHash = null;
    card.activationTokenExpiresAt = null;
    card.unlinkedAt = new Date();
    card.unlinkedBy = actorContext.actorId;
    if (reason) {
      card.notes = card.notes ? `${card.notes} [Unassigned: ${reason}]` : `[Unassigned: ${reason}]`;
    }

    await card.save();

    eventBus.emitEvent(APP_EVENTS.CARD_UNLINKED, {
      cardId: card._id,
      cardUid: card.cardUid,
      serialNumber: card.serialNumber,
      oldMemberId,
      reason,
      actorId: actorContext.actorId,
      previousValue,
      newValue: card.toObject()
    });

    return {
      message: `Card ${card.cardUid} successfully unassigned and returned to inventory.`,
      card
    };
  }

  async generateActivationLink(cardId, actorContext = {}) {
    const card = await Card.findById(cardId).populate('memberId', 'name email');
    if (!card) {
      throw new NotFoundError('Card not found.');
    }

    if (card.status !== 'activation_pending' && card.status !== 'available') {
      throw new BadRequestError(`Cannot generate activation link for card in "${card.status}" state.`);
    }

    if (!card.memberId) {
      throw new BadRequestError('Please assign this card to a team member before generating an activation link.');
    }

    const rawToken = this._generateSecureToken();
    const tokenHash = this._hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    card.activationTokenHash = tokenHash;
    card.activationTokenExpiresAt = expiresAt;
    card.status = 'activation_pending';
    await card.save();

    return {
      message: `Activation link generated for ${card.memberId.name}.`,
      cardUid: card.cardUid,
      rawToken,
      activationUrl: `/card/activate/${rawToken}`,
      expiresAt
    };
  }

  async updateCardStatus(id, { status, reason }, actorContext = {}) {
    const card = await Card.findById(id);
    if (!card) {
      throw new NotFoundError('Card not found.');
    }

    const previousValue = card.toObject();

    // Map legacy inputs if any
    let targetStatus = status;
    if (status === 'unassigned') targetStatus = 'available';
    if (status === 'linked') targetStatus = 'active';
    if (status === 'blocked') targetStatus = 'suspended';
    if (status === 'lost' || status === 'retired') targetStatus = 'deactivated';

    card.status = targetStatus;

    if (targetStatus === 'available') {
      card.memberId = null;
      card.profileId = null;
      card.activationTokenHash = null;
      card.activationTokenExpiresAt = null;
      card.unlinkedAt = new Date();
      card.unlinkedBy = actorContext.actorId;
    }

    if (reason) {
      card.notes = card.notes ? `${card.notes} [Status ${targetStatus}: ${reason}]` : `[Status ${targetStatus}: ${reason}]`;
    }

    await card.save();

    eventBus.emitEvent(APP_EVENTS.CARD_STATUS_CHANGED, {
      cardId: card._id,
      cardUid: card.cardUid,
      newStatus: targetStatus,
      reason,
      actorId: actorContext.actorId,
      previousValue,
      newValue: card.toObject()
    });

    return card;
  }

  async deleteCard(id, actorContext = {}) {
    const card = await Card.findById(id);
    if (!card) {
      throw new NotFoundError('Card not found.');
    }

    if ((card.status === 'active' || card.status === 'linked') && card.memberId) {
      eventBus.emitEvent(APP_EVENTS.CARD_UNLINKED, {
        cardId: card._id,
        cardUid: card.cardUid,
        serialNumber: card.serialNumber,
        oldMemberId: card.memberId,
        reason: 'Auto-unlinked prior to card deletion',
        actorId: actorContext.actorId
      });
    }

    await Card.findByIdAndDelete(id);

    eventBus.emitEvent(APP_EVENTS.CARD_DELETED, {
      cardId: id,
      cardUid: card.cardUid,
      actorId: actorContext.actorId
    });

    return { message: `Card ${card.cardUid} deleted from inventory successfully.` };
  }

  async resolvePublicCardTap(cardUid, clientContext = {}) {
    const normalizedUid = cardUid.toUpperCase().trim();
    const card = await Card.findOne({
      $or: [{ cardUid: normalizedUid }, { serialNumber: normalizedUid }]
    })
      .populate('memberId', 'name designation status email')
      .populate('profileId', 'slug visibility published.headline published.avatarUrl')
      .lean();

    if (!card) {
      throw new NotFoundError(`Smart card "${cardUid}" not found in system.`);
    }

    let status = card.status;
    if (status === 'unassigned') status = 'available';
    if (status === 'linked') status = 'active';
    if (status === 'blocked') status = 'suspended';
    if (status === 'lost' || status === 'retired') status = 'deactivated';

    if (status === 'suspended') {
      return {
        status: 'suspended',
        cardUid: card.cardUid,
        cardType: card.cardType,
        message: 'This smart card has been temporarily suspended by the organization.'
      };
    }

    if (status === 'deactivated') {
      return {
        status: 'deactivated',
        cardUid: card.cardUid,
        cardType: card.cardType,
        message: 'This smart card has been deactivated or reported lost.'
      };
    }

    if (status === 'available' || !card.memberId) {
      return {
        status: 'available',
        cardUid: card.cardUid,
        cardType: card.cardType,
        message: 'This smart card is currently unassigned and ready for setup.'
      };
    }

    if (status === 'activation_pending') {
      return {
        status: 'activation_pending',
        cardUid: card.cardUid,
        cardType: card.cardType,
        assignedTo: {
          name: card.memberId?.name || '',
          designation: card.memberId?.designation || ''
        },
        message: 'This smart card is assigned and pending activation by its owner.'
      };
    }

    // Card is ACTIVE -> record tap telemetry
    await Card.findByIdAndUpdate(card._id, {
      $inc: { tapCount: 1 },
      $set: { lastTappedAt: new Date() }
    });

    const slug = card.profileId?.slug || '';

    // Record tap asynchronously
    if (slug) {
      analyticsService.recordEvent({
        eventType: 'qr_scan',
        targetType: 'EMPLOYEE',
        targetId: card.profileId._id,
        slug,
        metadata: {
          cardUid: card.cardUid,
          cardType: card.cardType,
          serialNumber: card.serialNumber
        },
        ...clientContext
      }).catch(() => {});
    }

    return {
      status: 'active',
      cardUid: card.cardUid,
      cardType: card.cardType,
      slug,
      redirectUrl: slug ? `/p/${slug}` : null,
      member: {
        name: card.memberId?.name || '',
        designation: card.memberId?.designation || ''
      }
    };
  }
}

export const cardService = new CardService();
