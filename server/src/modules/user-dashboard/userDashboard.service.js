import { TeamMember } from '../team-members/teamMember.model.js';
import { Card } from '../cards/card.model.js';
import { Department } from '../departments/department.model.js';
import { CompanyProfile } from '../company-profile/companyProfile.model.js';
import { Connection } from '../connections/connection.model.js';
import { Event } from '../events/event.model.js';
import { EventRegistration } from '../events/eventRegistration.model.js';
import { AnalyticsEvent } from '../analytics/analyticsEvent.model.js';
import { Notification } from '../notifications/notification.model.js';
import { User } from '../users/user.model.js';
import { NotFoundError } from '../../errors/index.js';

class UserDashboardService {
  async getUserHome(userId) {
    let member = await TeamMember.findOne({ userId })
      .populate('departmentId', 'name description headMemberId')
      .populate('profileId')
      .lean();

    if (!member) {
      const user = await User.findById(userId).lean();
      if (user && user.email === 'superadmin@onewinq.com') {
        member = await TeamMember.findOne({ status: 'active' })
          .populate('departmentId', 'name description headMemberId')
          .populate('profileId')
          .lean();
      }
    }

    if (!member) {
      throw new NotFoundError('Team member profile not found.');
    }

    const now = new Date();

    // 1. Personal Stats
    const [connectionsCount, pendingRequestsCount, profileViews, registeredEventsCount] = await Promise.all([
      Connection.countDocuments({
        $or: [{ requesterId: userId }, { recipientId: userId }],
        status: 'accepted'
      }),
      Connection.countDocuments({
        recipientId: userId,
        status: 'pending'
      }),
      member.profileId
        ? AnalyticsEvent.countDocuments({ targetId: member.profileId._id, eventType: 'page_view' })
        : 0,
      EventRegistration.countDocuments({
        userId,
        status: 'registered'
      })
    ]);

    // 2. My Department Widget
    let departmentWidget = null;
    if (member.departmentId) {
      const deptId = member.departmentId._id;
      const [deptHead, deptColleagues, totalDeptMembers] = await Promise.all([
        member.departmentId.headMemberId
          ? TeamMember.findById(member.departmentId.headMemberId).select('name designation').lean()
          : null,
        TeamMember.find({ departmentId: deptId, status: 'active', userId: { $ne: userId } })
          .populate('profileId', 'slug published.avatarUrl published.headline')
          .limit(4)
          .lean(),
        TeamMember.countDocuments({ departmentId: deptId, status: 'active' })
      ]);

      departmentWidget = {
        _id: deptId,
        name: member.departmentId.name,
        description: member.departmentId.description,
        head: deptHead,
        memberCount: totalDeptMembers,
        colleagues: deptColleagues.map((c) => ({
          _id: c._id,
          userId: c.userId,
          name: c.name,
          designation: c.designation,
          slug: c.profileId?.slug || '',
          avatarUrl: c.profileId?.published?.avatarUrl || '',
          headline: c.profileId?.published?.headline || ''
        }))
      };
    }

    // 3. Company Snapshot Widget
    const company = await CompanyProfile.findOne({ isPublic: true })
      .select('name tagline industry location branding website description')
      .lean();

    const companyWidget = company
      ? {
          name: company.name,
          tagline: company.tagline,
          industry: company.industry,
          location: [company.location?.city, company.location?.state, company.location?.country].filter(Boolean).join(', ') || 'Indore, Madhya Pradesh',
          logoUrl: company.branding?.logoUrl || '',
          website: company.website,
          description: company.description
        }
      : null;

    // 4. Upcoming Events Widget (Up to 3 upcoming eligible events)
    const upcomingEvents = await Event.find({
      status: 'published',
      endDate: { $gte: now }
    })
      .sort({ startDate: 1 })
      .limit(6)
      .lean();

    const deptIdStr = member.departmentId?._id ? member.departmentId._id.toString() : null;
    const roleIdStr = member.roleId ? member.roleId.toString() : null;

    const eligibleEvents = upcomingEvents.filter((ev) => {
      if (!ev.eligibility || ev.eligibility.type === 'all') return true;
      if (ev.eligibility.type === 'departments' && deptIdStr) {
        return ev.eligibility.departmentIds?.some((d) => d.toString() === deptIdStr);
      }
      if (ev.eligibility.type === 'roles' && roleIdStr) {
        return ev.eligibility.roleIds?.some((r) => r.toString() === roleIdStr);
      }
      return false;
    }).slice(0, 3);

    const eligibleEventIds = eligibleEvents.map((e) => e._id);
    const userRegistrations = await EventRegistration.find({
      eventId: { $in: eligibleEventIds },
      userId,
      status: 'registered'
    }).lean();

    const userRegSet = new Set(userRegistrations.map((r) => r.eventId.toString()));

    const eventsWidget = eligibleEvents.map((ev) => ({
      _id: ev._id,
      title: ev.title,
      category: ev.category,
      coverImageUrl: ev.coverImageUrl,
      startDate: ev.startDate,
      endDate: ev.endDate,
      locationType: ev.locationType,
      locationAddress: ev.locationAddress,
      isRegistered: userRegSet.has(ev._id.toString())
    }));

    // 5. Recent Notifications / Activity Widget
    const recentNotifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 6. Recently Active People (Colleagues to connect with)
    const [activeColleagues, myConnections] = await Promise.all([
      TeamMember.find({
        status: 'active',
        userId: { $ne: userId, $exists: true }
      })
        .populate('departmentId', 'name')
        .populate('profileId', 'slug published.avatarUrl published.headline published.location published.skills')
        .limit(8)
        .lean(),
      Connection.find({
        $or: [{ requesterId: userId }, { recipientId: userId }]
      }).lean()
    ]);

    const acceptedSet = new Set();
    const pendingSet = new Set();
    myConnections.forEach((conn) => {
      const otherId = conn.requesterId.toString() === userId.toString() ? conn.recipientId.toString() : conn.requesterId.toString();
      if (conn.status === 'accepted') acceptedSet.add(otherId);
      if (conn.status === 'pending') pendingSet.add(otherId);
    });

    const recentlyActivePeople = activeColleagues.map((c) => ({
      _id: c._id,
      userId: c.userId,
      name: c.name,
      designation: c.designation,
      department: c.departmentId?.name || '',
      avatarUrl: c.profileId?.published?.avatarUrl || '',
      slug: c.profileId?.slug || '',
      location: c.profileId?.published?.location || 'Indore, MP',
      skills: c.profileId?.published?.skills || [],
      connectionStatus: acceptedSet.has(c.userId?.toString())
        ? 'connected'
        : pendingSet.has(c.userId?.toString())
        ? 'pending'
        : 'none'
    }));

    // 7. My NFC Card Widget
    let nfcCardWidget = null;
    if (member._id) {
      const card = await Card.findOne({
        memberId: member._id,
        status: { $in: ['active', 'linked', 'activation_pending', 'suspended'] }
      }).select('cardUid serialNumber cardType status tapCount lastTappedAt activatedAt assignedAt').lean();

      if (card) {
        let normalizedStatus = card.status;
        if (card.status === 'linked') normalizedStatus = 'active';
        if (card.status === 'blocked') normalizedStatus = 'suspended';
        nfcCardWidget = { ...card, status: normalizedStatus };
      }
    }

    return {
      hero: {
        memberId: member._id,
        userId: member.userId,
        employeeId: member.employeeId,
        name: member.name,
        designation: member.designation,
        department: member.departmentId?.name || '',
        companyName: company?.name || 'OneWinq Enterprise',
        slug: member.profileId?.slug || '',
        avatarUrl: member.profileId?.published?.avatarUrl || '',
        coverUrl: member.profileId?.published?.coverUrl || '',
        headline: member.profileId?.published?.headline || '',
        bio: member.profileId?.published?.bio || '',
        location: member.profileId?.published?.location || 'Indore, MP',
        profileCompletionScore: member.profileCompletionScore || 85,
        isVerified: true,
        nfcCard: nfcCardWidget
      },
      nfcCard: nfcCardWidget,
      stats: {
        connectionsCount,
        pendingRequestsCount,
        profileViews,
        registeredEventsCount
      },
      myDepartment: departmentWidget,
      companySnapshot: companyWidget,
      upcomingEvents: eventsWidget,
      recentActivity: recentNotifications,
      recentlyActivePeople
    };
  }
}

export const userDashboardService = new UserDashboardService();
