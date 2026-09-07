import { v4 as uuidv4 } from 'uuid';
import { Event } from './event.model.js';
import { EventRegistration } from './eventRegistration.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { notificationService } from '../notifications/notification.service.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from '../../errors/index.js';

class EventService {
  async getEligibleEvents(userContext = {}, query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 10);
    const now = new Date();
    const filter = { status: 'published' };

    if (query.category) {
      filter.category = query.category;
    }

    if (query.timeframe === 'past') {
      filter.endDate = { $lt: now };
    } else if (query.timeframe === 'all') {
      // no date constraint
    } else {
      // upcoming (default)
      filter.endDate = { $gte: now };
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { locationAddress: { $regex: query.search, $options: 'i' } }
      ];
    }

    // Determine user's department and role
    const member = userContext.member || (await TeamMember.findOne({ userId: userContext.userId }).lean());
    const departmentId = member?.departmentId ? member.departmentId.toString() : null;
    const roleId = member?.roleId ? member.roleId.toString() : null;

    const allEvents = await Event.find(filter)
      .sort(sort || { startDate: 1 })
      .lean();

    // Filter events by eligibility in memory
    const eligibleEvents = allEvents.filter((ev) => {
      if (!ev.eligibility || ev.eligibility.type === 'all') return true;
      if (ev.eligibility.type === 'departments' && departmentId) {
        return ev.eligibility.departmentIds?.some((d) => d.toString() === departmentId);
      }
      if (ev.eligibility.type === 'roles' && roleId) {
        return ev.eligibility.roleIds?.some((r) => r.toString() === roleId);
      }
      return false;
    });

    const totalItems = eligibleEvents.length;
    const paginatedEvents = eligibleEvents.slice(skip, skip + limit);

    // Look up user's registrations and attendee counts
    const eventIds = paginatedEvents.map((e) => e._id);
    const [myRegistrations, attendeeCounts] = await Promise.all([
      EventRegistration.find({
        eventId: { $in: eventIds },
        userId: userContext.userId,
        status: 'registered'
      }).lean(),
      EventRegistration.aggregate([
        { $match: { eventId: { $in: eventIds }, status: 'registered' } },
        { $group: { _id: '$eventId', count: { $sum: 1 } } }
      ])
    ]);

    const regMap = new Map(myRegistrations.map((r) => [r.eventId.toString(), r]));
    const countMap = new Map(attendeeCounts.map((a) => [a._id.toString(), a.count]));

    const enriched = paginatedEvents.map((ev) => {
      const myReg = regMap.get(ev._id.toString());
      const attendeeCount = countMap.get(ev._id.toString()) || 0;
      return {
        ...ev,
        attendeeCount,
        isRegistered: !!myReg,
        ticketCode: myReg?.ticketCode || null,
        registeredAt: myReg?.registeredAt || null
      };
    });

    return {
      events: enriched,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async getEventById(eventId, userContext = {}) {
    const event = await Event.findById(eventId).lean();
    if (!event) {
      throw new NotFoundError('Event not found.');
    }

    const member = userContext.member || (await TeamMember.findOne({ userId: userContext.userId }).lean());
    const departmentId = member?.departmentId ? member.departmentId.toString() : null;
    const roleId = member?.roleId ? member.roleId.toString() : null;

    // Check eligibility
    if (event.eligibility && event.eligibility.type !== 'all') {
      let isEligible = false;
      if (event.eligibility.type === 'departments' && departmentId) {
        isEligible = event.eligibility.departmentIds?.some((d) => d.toString() === departmentId);
      } else if (event.eligibility.type === 'roles' && roleId) {
        isEligible = event.eligibility.roleIds?.some((r) => r.toString() === roleId);
      }
      if (!isEligible && !userContext.isSuperAdmin) {
        throw new ForbiddenError('This event has restricted access and is not open to your department/role.');
      }
    }

    const [myReg, attendeeCount] = await Promise.all([
      EventRegistration.findOne({ eventId, userId: userContext.userId, status: 'registered' }).lean(),
      EventRegistration.countDocuments({ eventId, status: 'registered' })
    ]);

    return {
      ...event,
      attendeeCount,
      isRegistered: !!myReg,
      ticketCode: myReg?.ticketCode || null,
      registeredAt: myReg?.registeredAt || null
    };
  }

  async registerForEvent(eventId, userContext = {}) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found.');
    }

    if (event.status !== 'published') {
      throw new BadRequestError('Cannot register for an event that is not currently published.');
    }

    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      throw new BadRequestError('Registration deadline for this event has passed.');
    }

    if (new Date() > new Date(event.endDate)) {
      throw new BadRequestError('This event has already concluded.');
    }

    // Capacity check
    if (event.maxCapacity > 0) {
      const currentAttendees = await EventRegistration.countDocuments({ eventId, status: 'registered' });
      if (currentAttendees >= event.maxCapacity) {
        throw new ConflictError('This event has reached maximum capacity.');
      }
    }

    // Check eligibility
    const member = userContext.member || (await TeamMember.findOne({ userId: userContext.userId }).lean());
    const departmentId = member?.departmentId ? member.departmentId.toString() : null;
    const roleId = member?.roleId ? member.roleId.toString() : null;

    if (event.eligibility && event.eligibility.type !== 'all') {
      let isEligible = false;
      if (event.eligibility.type === 'departments' && departmentId) {
        isEligible = event.eligibility.departmentIds?.some((d) => d.toString() === departmentId);
      } else if (event.eligibility.type === 'roles' && roleId) {
        isEligible = event.eligibility.roleIds?.some((r) => r.toString() === roleId);
      }
      if (!isEligible && !userContext.isSuperAdmin) {
        throw new ForbiddenError('You are not eligible to register for this restricted event.');
      }
    }

    const existing = await EventRegistration.findOne({ eventId, userId: userContext.userId });
    if (existing) {
      if (existing.status === 'registered') {
        throw new ConflictError('You are already registered for this event.');
      }
      // Re-activate cancelled registration
      existing.status = 'registered';
      existing.registeredAt = new Date();
      await existing.save();

      await this._notifyRegistration(event, userContext.userId, existing.ticketCode);
      return existing;
    }

    const ticketCode = `OWQ-EVT-${uuidv4().substring(0, 8).toUpperCase()}`;

    const registration = await EventRegistration.create({
      eventId,
      userId: userContext.userId,
      status: 'registered',
      ticketCode
    });

    await this._notifyRegistration(event, userContext.userId, ticketCode);

    return registration;
  }

  async _notifyRegistration(event, userId, ticketCode) {
    await notificationService.createNotification({
      recipientId: userId,
      type: 'event_registration',
      title: 'Event Registration Confirmed',
      message: `Your registration for "${event.title}" is confirmed! Ticket Code: ${ticketCode}`,
      data: {
        eventId: event._id,
        eventTitle: event.title,
        ticketCode,
        startDate: event.startDate
      }
    });

    eventBus.emitEvent(APP_EVENTS.EVENT_REGISTERED, {
      eventId: event._id,
      userId,
      ticketCode
    });
  }

  async cancelRegistration(eventId, userId) {
    const registration = await EventRegistration.findOneAndUpdate(
      { eventId, userId, status: 'registered' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!registration) {
      throw new NotFoundError('Active event registration not found.');
    }

    eventBus.emitEvent(APP_EVENTS.EVENT_REGISTRATION_CANCELLED, {
      eventId,
      userId
    });

    return { message: 'Event registration cancelled successfully.' };
  }

  async getMyEvents(userId, query = {}) {
    const { page, limit, skip } = parsePagination(query, 10);
    const filter = { userId, status: 'registered' };

    const registrations = await EventRegistration.find(filter)
      .populate('eventId')
      .sort({ registeredAt: -1 })
      .lean();

    const now = new Date();
    const upcoming = [];
    const past = [];

    registrations.forEach((reg) => {
      if (!reg.eventId) return;
      const item = {
        registrationId: reg._id,
        ticketCode: reg.ticketCode,
        registeredAt: reg.registeredAt,
        status: reg.status,
        event: reg.eventId
      };

      if (new Date(reg.eventId.endDate) >= now) {
        upcoming.push(item);
      } else {
        past.push(item);
      }
    });

    const targetList = query.timeframe === 'past' ? past : upcoming;
    const paginated = targetList.slice(skip, skip + limit);

    return {
      events: paginated,
      upcomingCount: upcoming.length,
      pastCount: past.length,
      pagination: formatPaginationMeta(targetList.length, page, limit)
    };
  }

  // Admin Event Management
  async createEvent(data, actorId) {
    let slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let existing = await Event.findOne({ slug });
    let counter = 1;
    while (existing) {
      slug = `${slug}-${counter}`;
      counter++;
      existing = await Event.findOne({ slug });
    }

    const event = await Event.create({
      ...data,
      slug,
      organizer: actorId
    });

    eventBus.emitEvent(APP_EVENTS.EVENT_CREATED, {
      eventId: event._id,
      title: event.title,
      actorId
    });

    return event;
  }

  async updateEvent(id, data, actorId) {
    const event = await Event.findByIdAndUpdate(id, data, { new: true });
    if (!event) {
      throw new NotFoundError('Event not found.');
    }

    eventBus.emitEvent(APP_EVENTS.EVENT_UPDATED, {
      eventId: event._id,
      title: event.title,
      actorId
    });

    return event;
  }

  async cancelEvent(id, actorId) {
    const event = await Event.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    if (!event) {
      throw new NotFoundError('Event not found.');
    }

    eventBus.emitEvent(APP_EVENTS.EVENT_CANCELLED, {
      eventId: event._id,
      title: event.title,
      actorId
    });

    return { message: `Event "${event.title}" has been cancelled.` };
  }

  async getEventAttendees(eventId, query = {}) {
    const { page, limit, skip } = parsePagination(query, 20);
    const filter = { eventId, status: 'registered' };

    const [attendees, totalItems] = await Promise.all([
      EventRegistration.find(filter)
        .populate({
          path: 'userId',
          select: 'email'
        })
        .sort({ registeredAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      EventRegistration.countDocuments(filter)
    ]);

    const userIds = attendees.map((a) => a.userId?._id).filter(Boolean);
    const members = await TeamMember.find({ userId: { $in: userIds } })
      .populate('departmentId', 'name')
      .lean();

    const memberMap = new Map(members.map((m) => [m.userId.toString(), m]));

    const formattedAttendees = attendees.map((a) => {
      const m = memberMap.get(a.userId?._id?.toString());
      return {
        registrationId: a._id,
        ticketCode: a.ticketCode,
        registeredAt: a.registeredAt,
        user: {
          userId: a.userId?._id,
          email: a.userId?.email,
          name: m?.name || '',
          designation: m?.designation || '',
          department: m?.departmentId?.name || ''
        }
      };
    });

    return {
      attendees: formattedAttendees,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }
}

export const eventService = new EventService();
