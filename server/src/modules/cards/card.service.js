import { Card } from './card.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
import { analyticsService } from '../analytics/analytics.service.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../errors/index.js';

class CardService {
  async getAllCards(query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 15);
    const filter = {};

    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }
    if (query.cardType) {
      filter.cardType = query.cardType;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      // Look up member IDs matching search
      const matchingMembers = await TeamMember.find({
        $or: [{ name: searchRegex }, { employeeId: searchRegex }]
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
          select: 'name designation employeeId departmentId status',
          populate: { path: 'departmentId', select: 'name' }
        })
        .populate({
          path: 'profileId',
          select: 'slug published.avatarUrl'
        })
        .populate('linkedBy', 'email')
        .populate('unlinkedBy', 'email')
        .sort(sort || { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Card.countDocuments(filter)
    ]);

    const formattedCards = cards.map((c) => ({
      _id: c._id,
      cardUid: c.cardUid,
      serialNumber: c.serialNumber,
      cardType: c.cardType,
      batchNumber: c.batchNumber,
      status: c.status,
      tapCount: c.tapCount || 0,
      lastTappedAt: c.lastTappedAt,
      linkedAt: c.linkedAt,
      linkedBy: c.linkedBy ? c.linkedBy.email : null,
      unlinkedAt: c.unlinkedAt,
      unlinkedBy: c.unlinkedBy ? c.unlinkedBy.email : null,
      notes: c.notes,
      createdAt: c.createdAt,
      member: c.memberId
        ? {
            _id: c.memberId._id,
            name: c.memberId.name,
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
    }));

    return {
      cards: formattedCards,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async getCardStats() {
    const [totalCards, linkedCards, unassignedCards, blockedCards, lostCards, tapStats, byType] = await Promise.all([
      Card.countDocuments(),
      Card.countDocuments({ status: 'linked' }),
      Card.countDocuments({ status: 'unassigned' }),
      Card.countDocuments({ status: 'blocked' }),
      Card.countDocuments({ status: 'lost' }),
      Card.aggregate([{ $group: { _id: null, totalTaps: { $sum: '$tapCount' } } }]),
      Card.aggregate([{ $group: { _id: '$cardType', count: { $sum: 1 } } }])
    ]);

    const typeBreakdown = {};
    byType.forEach((b) => {
      typeBreakdown[b._id] = b.count;
    });

    return {
      totalCards,
      linkedCards,
      unassignedCards,
      blockedCards,
      lostCards,
      totalTaps: tapStats[0]?.totalTaps || 0,
      typeBreakdown
    };
  }

  async getCardById(id) {
    const card = await Card.findById(id)
      .populate({
        path: 'memberId',
        select: 'name designation employeeId departmentId status joiningDate',
        populate: { path: 'departmentId', select: 'name' }
      })
      .populate({
        path: 'profileId',
        select: 'slug templateId published.avatarUrl published.headline visibility'
      })
      .populate('linkedBy', 'email')
      .populate('unlinkedBy', 'email')
      .lean();

    if (!card) {
      throw new NotFoundError('Card not found.');
    }

    return card;
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
      status: 'unassigned'
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

    // Check for duplicate in input list
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
      status: 'unassigned'
    }));

    const inserted = await Card.insertMany(cardsToInsert);

    eventBus.emitEvent(APP_EVENTS.CARD_CREATED, {
      count: inserted.length,
      actorId
    });

    return {
      message: `Successfully registered ${inserted.length} cards into inventory.`,
      cards: inserted
    };
  }

  async linkCard({ cardId, cardUid, memberId, employeeId, notes }, actorContext = {}) {
    // 1. Resolve Card
    let cardQuery = {};
    if (cardId) cardQuery._id = cardId;
    else if (cardUid) cardQuery.cardUid = cardUid.toUpperCase().trim();

    const card = await Card.findOne(cardQuery);
    if (!card) {
      throw new NotFoundError('Card not found in inventory.');
    }

    if (card.status === 'blocked' || card.status === 'lost') {
      throw new BadRequestError(`Cannot link a card that is marked as "${card.status}". Please unblock it first.`);
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
      throw new BadRequestError('Cannot link card to an inactive/archived team member.');
    }

    // 3. Resolve EmployeeProfile
    let profile = null;
    if (member.profileId) {
      profile = await EmployeeProfile.findById(member.profileId);
    }
    if (!profile) {
      profile = await EmployeeProfile.findOne({ memberId: member._id });
    }

    const previousValue = card.toObject();

    // 4. Update Card
    card.status = 'linked';
    card.memberId = member._id;
    card.profileId = profile ? profile._id : null;
    card.linkedAt = new Date();
    card.linkedBy = actorContext.actorId;
    card.unlinkedAt = null;
    card.unlinkedBy = null;
    if (notes !== undefined) card.notes = notes;

    await card.save();

    eventBus.emitEvent(APP_EVENTS.CARD_LINKED, {
      cardId: card._id,
      cardUid: card.cardUid,
      serialNumber: card.serialNumber,
      memberId: member._id,
      memberName: member.name,
      employeeId: member.employeeId,
      actorId: actorContext.actorId,
      previousValue,
      newValue: card.toObject()
    });

    const populatedCard = await this.getCardById(card._id);
    return populatedCard;
  }

  async unlinkCard({ cardId, memberId, reason }, actorContext = {}) {
    let query = {};
    if (cardId) query._id = cardId;
    else if (memberId) query.memberId = memberId;

    const card = await Card.findOne(query);
    if (!card) {
      throw new NotFoundError('Card not found.');
    }

    if (card.status !== 'linked' && !card.memberId) {
      throw new BadRequestError('This card is not currently linked to any team member.');
    }

    const previousValue = card.toObject();
    const oldMemberId = card.memberId;

    card.status = 'unassigned';
    card.memberId = null;
    card.profileId = null;
    card.unlinkedAt = new Date();
    card.unlinkedBy = actorContext.actorId;
    if (reason) {
      card.notes = card.notes ? `${card.notes} [Unlinked: ${reason}]` : `[Unlinked: ${reason}]`;
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
      message: `Card ${card.cardUid} successfully unlinked and returned to inventory.`,
      card
    };
  }

  async updateCardStatus(id, { status, reason }, actorContext = {}) {
    const card = await Card.findById(id);
    if (!card) {
      throw new NotFoundError('Card not found.');
    }

    const previousValue = card.toObject();

    card.status = status;
    if (status === 'unassigned') {
      card.memberId = null;
      card.profileId = null;
      card.unlinkedAt = new Date();
      card.unlinkedBy = actorContext.actorId;
    }

    if (reason) {
      card.notes = card.notes ? `${card.notes} [Status ${status}: ${reason}]` : `[Status ${status}: ${reason}]`;
    }

    await card.save();

    eventBus.emitEvent(APP_EVENTS.CARD_STATUS_CHANGED, {
      cardId: card._id,
      cardUid: card.cardUid,
      newStatus: status,
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

    if (card.status === 'linked' && card.memberId) {
      throw new BadRequestError('Cannot delete a card that is currently linked. Please unlink it first.');
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
      .populate('memberId', 'name designation status')
      .populate('profileId', 'slug visibility published.headline published.avatarUrl')
      .lean();

    if (!card) {
      throw new NotFoundError(`Smart card "${cardUid}" not found in system.`);
    }

    if (card.status === 'blocked' || card.status === 'lost') {
      return {
        status: 'blocked',
        cardUid: card.cardUid,
        cardType: card.cardType,
        message: 'This smart card has been deactivated or reported lost by the organization.'
      };
    }

    if (card.status === 'unassigned' || !card.memberId) {
      return {
        status: 'unassigned',
        cardUid: card.cardUid,
        cardType: card.cardType,
        message: 'This smart card is currently unassigned and ready for activation.'
      };
    }

    // Card is linked and active -> record tap
    await Card.findByIdAndUpdate(card._id, {
      $inc: { tapCount: 1 },
      $set: { lastTappedAt: new Date() }
    });

    const slug = card.profileId?.slug || '';

    // Ingest telemetry asynchronously
    if (slug) {
      analyticsService.recordEvent({
        eventType: 'qr_scan', // or nfc_tap
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
      status: 'linked',
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
