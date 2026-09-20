import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
import { ProfileSlugHistory } from '../employee-profile/profileSlugHistory.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { templateResolverService } from '../templates/templateResolver.service.js';
import { CompanyProfile } from '../company-profile/companyProfile.model.js';
import { Connection } from '../connections/connection.model.js';
import { Card } from '../cards/card.model.js';
import { generateQRCodeDataUrl, generateQRCodeSvg } from '../../utils/qrCode.util.js';
import { NotFoundError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { env } from '../../config/env.config.js';

class PublicProfileService {
  async getPublicTeamMembers() {
    const members = await TeamMember.find({
      status: 'active',
      isArchived: false,
      isDeleted: { $ne: true },
      isSystem: { $ne: true }
    })
      .populate('departmentId', 'name slug')
      .populate({
        path: 'profileId',
        select: 'slug published avatarUrl'
      })
      .sort({ createdAt: 1 })
      .lean();

    return members.map((m) => {
      const pub = m.profileId?.published || {};
      return {
        _id: m._id,
        name: m.name,
        designation: m.designation,
        department: m.departmentId?.name || '',
        departmentSlug: m.departmentId?.slug || '',
        avatarUrl: pub.avatarUrl || m.avatarUrl || '',
        bio: pub.bio || pub.headline || '',
        slug: m.profileId?.slug || '',
        isVerified: true
      };
    });
  }

  async getPublicProfileBySlug(slug, clientContext = {}) {
    const rawIdentifier = (slug || '').trim();
    if (!rawIdentifier) {
      throw new NotFoundError('Profile identifier is required.', ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const normalizedSlug = rawIdentifier.toLowerCase();
    let isRedirect = false;
    let canonicalSlug = null;

    const populateOpts = [
      {
        path: 'memberId',
        match: { status: 'active', isArchived: false, isDeleted: { $ne: true } },
        select: 'name employeeId designation departmentId roleId joiningDate',
        populate: [
          { path: 'departmentId', select: 'name slug description templateId', populate: { path: 'templateId' } },
          { path: 'roleId', select: 'name slug permissions isSystem' }
        ]
      },
      { path: 'templateId' }
    ];

    // 1. Resolve by current active slug
    let profile = await EmployeeProfile.findOne({
      slug: normalizedSlug,
      visibility: 'public'
    })
      .populate(populateOpts)
      .lean();

    // 2. Resolve by historical slug (for old QR codes, NFC cards, shared links)
    if (!profile || !profile.memberId) {
      const historyRecord = await ProfileSlugHistory.findOne({ slug: normalizedSlug }).lean();
      if (historyRecord?.profileId) {
        const histProfile = await EmployeeProfile.findOne({
          _id: historyRecord.profileId,
          visibility: 'public'
        })
          .populate(populateOpts)
          .lean();

        if (histProfile && histProfile.memberId) {
          profile = histProfile;
          isRedirect = true;
          canonicalSlug = profile.slug;
        }
      }
    }

    // 3. Resolve by active employeeId (e.g. OWQ-001) as an alternative identifier
    if (!profile || !profile.memberId) {
      const member = await TeamMember.findOne({
        employeeId: rawIdentifier.toUpperCase(),
        status: 'active',
        isArchived: false,
        isDeleted: { $ne: true }
      }).select('_id profileId').lean();

      if (member) {
        const empProfile = await EmployeeProfile.findOne({
          $or: [{ memberId: member._id }, { _id: member.profileId }],
          visibility: 'public'
        })
          .populate(populateOpts)
          .lean();

        if (empProfile && empProfile.memberId) {
          profile = empProfile;
          isRedirect = true;
          canonicalSlug = profile.slug;
        }
      }
    }

    if (!profile || !profile.memberId) {
      throw new NotFoundError(`Public profile '${rawIdentifier}' not found or is private.`, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const publicUrl = `${env.PUBLIC_PROFILE_BASE_URL}/${profile.slug}`;
    const qrCodeDataUrl = await generateQRCodeDataUrl(publicUrl);

    // Record non-blocking analytics event
    eventBus.emitEvent(APP_EVENTS.ANALYTICS_EVENT_RECORDED, {
      eventType: 'PROFILE_VIEW',
      targetType: 'EMPLOYEE',
      targetId: profile.memberId._id,
      slug: profile.slug,
      templateId: profile.templateId?._id,
      ipAddress: clientContext.ipAddress,
      userAgent: clientContext.userAgent,
      referer: clientContext.referer
    });

    // Fetch organization branding for shared cover banner & company identity
    const company = await CompanyProfile.findOne({ isPublic: true }).select('name branding').lean();
    const orgCoverUrl = company?.branding?.coverUrl || '';
    const orgLogoUrl = company?.branding?.logoUrl || '';

    // Resolve dynamic profile template based on cascading priority (Explicit Template -> Designation -> Department -> Fallback)
    const resolvedTemplate = await templateResolverService.resolveTemplateForMember({
      role: profile.memberId?.roleId,
      department: profile.memberId?.departmentId,
      designation: profile.memberId?.designation,
      templateId: profile.templateId,
      themeOverrides: profile.themeOverrides
    });

    const pub = profile.published || profile.draft || {};
    const pre = resolvedTemplate.predefinedDetails || {};

    // 1. Calculate dynamic connections:
    // Look up real accepted connections in the database for this user
    let realConnections = 0;
    if (profile.userId) {
      realConnections = await Connection.countDocuments({
        $or: [{ requesterId: profile.userId }, { recipientId: profile.userId }],
        status: 'accepted'
      });
    }

    // Look up member NFC card tap metrics
    const memberCard = await Card.findOne({
      memberId: profile.memberId?._id || profile.memberId
    }).select('tapCount').lean();
    const tapCount = memberCard?.tapCount || 0;

    // 2. Calculate real experience years from actual experience records
    let realYears = 0;
    if (pub.experience && pub.experience.length > 0) {
      pub.experience.forEach((exp) => {
        const start = exp.startDate ? new Date(exp.startDate) : null;
        const end = exp.endDate ? new Date(exp.endDate) : (exp.isCurrent ? new Date() : null);
        if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const diff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24 * 365.25)));
          realYears += diff;
        } else {
          realYears += 1;
        }
      });
    }

    const realProjectsCount = (pub.projects || []).length;

    // Filter out static legacy seed values ('248', '248+', '150+', '25+', '8+', '5+', '6+')
    const isLegacySeed = (val, legacyDefaults) => {
      if (!val) return true;
      const str = String(val).trim();
      return legacyDefaults.includes(str);
    };

    const legacyConnections = ['248', '248+', '150', '150+', '500+'];
    const legacyProjects = ['25+', '25', '10+', '10'];
    const legacyYears = ['8+', '8', '5+', '5'];
    const legacyServices = ['5+', '5', '6+', '6'];

    const rawConn = pub.overviewStats?.connectionsCount || pub.overviewStats?.connections;
    const connectionsVal = (!isLegacySeed(rawConn, legacyConnections))
      ? String(rawConn)
      : (realConnections > 0 ? `${realConnections}+` : (tapCount > 0 ? `${tapCount}+` : '0'));

    const rawProj = pub.overviewStats?.projectsCount || pub.overviewStats?.projects;
    const projectsVal = (!isLegacySeed(rawProj, legacyProjects))
      ? String(rawProj)
      : (realProjectsCount > 0 ? `${realProjectsCount}+` : '0');

    const rawYears = pub.overviewStats?.yearsOfExperience || pub.overviewStats?.years;
    const yearsVal = (!isLegacySeed(rawYears, legacyYears))
      ? String(rawYears)
      : (realYears > 0 ? `${realYears}+` : '0');

    const rawServ = pub.overviewStats?.servicesCount || pub.overviewStats?.services;
    const servicesVal = (!isLegacySeed(rawServ, legacyServices))
      ? String(rawServ)
      : '0';

    const dynamicOverviewStats = {
      connectionsCount: connectionsVal,
      connections: connectionsVal,
      projectsCount: projectsVal,
      projects: projectsVal,
      yearsOfExperience: yearsVal,
      years: yearsVal,
      servicesCount: servicesVal,
      services: servicesVal,
      customMetrics: pub.overviewStats?.customMetrics || []
    };

    const firstName = profile.memberId.name?.trim().split(' ')[0] || 'Member';
    const introductionText = pub.about?.introduction || pub.bio || pub.headline || '';
    let expertiseText = '';
    if (typeof pub.about?.expertise === 'string' && pub.about.expertise.trim()) {
      expertiseText = pub.about.expertise.trim();
    } else if (Array.isArray(pub.about?.expertise) && pub.about.expertise.length > 0) {
      expertiseText = pub.about.expertise.map(s => s.name || s).join(', ');
    } else if (pub.headline) {
      expertiseText = pub.headline;
    }

    const expertiseList = (Array.isArray(pub.about?.expertise) && pub.about.expertise.length > 0)
      ? pub.about.expertise
      : (expertiseText ? [expertiseText] : []);

    const experienceSummaryText = pub.about?.experienceSummary
      || pub.about?.experience
      || `${dynamicOverviewStats.years || '5+'} in ${profile.memberId.departmentId?.name || 'Enterprise'} & ${profile.memberId.designation}.`;

    const normalizeExperienceItem = (item, idx) => {
      const company = item.company || item.organization || item.title || '';
      const role = item.role || item.designation || (item.company ? item.title : '') || item.subtitle || '';
      const isPresent = Boolean(
        item.isCurrent ||
        (item.to && /present|current/i.test(item.to)) ||
        (item.period && /present|current/i.test(item.period)) ||
        (item.year && /present|current/i.test(item.year))
      );

      const fromMonth = item.fromMonth || '';
      const fromYear = item.fromYear || item.from || '';
      const toMonth = isPresent ? '' : (item.toMonth || '');
      const toYear = isPresent ? 'PRESENT' : (item.toYear || item.to || '');

      let from = fromMonth && fromYear ? `${fromMonth} ${fromYear}` : (fromYear || item.from || '');
      let to = isPresent ? 'PRESENT' : (toMonth && toYear ? `${toMonth} ${toYear}` : (toYear || item.to || ''));

      // If from/to not explicitly provided, derive from period, year, or dates
      if (!from || (!to && !isPresent)) {
        const rawRange = item.period || item.year || '';
        if (rawRange.includes('-')) {
          const parts = rawRange.split('-');
          if (!from) from = parts[0].trim();
          if (!to && !isPresent) to = parts[1].trim();
        } else if (!from && rawRange) {
          from = rawRange.trim();
        }

        if (!from && item.startDate) {
          from = String(new Date(item.startDate).getFullYear());
        }
        if (!to && item.endDate && !isPresent) {
          to = String(new Date(item.endDate).getFullYear());
        }
      }

      let period = '';
      if (from && to) {
        period = isPresent ? `${from}- PRESENT` : `${from}- ${to}`;
      } else if (from) {
        period = isPresent ? `${from}- PRESENT` : from;
      } else if (to) {
        period = to;
      } else if (item.period) {
        period = item.period;
      } else if (isPresent) {
        period = 'PRESENT';
      }

      return {
        _id: item._id,
        company,
        role,
        title: role,
        fromMonth,
        fromYear,
        from,
        toMonth,
        toYear,
        to,
        period,
        isCurrent: isPresent,
        order: item.order ?? idx
      };
    };

    const expSource = (pub.experience && pub.experience.length > 0)
      ? pub.experience
      : (profile.draft?.experience && profile.draft.experience.length > 0)
      ? profile.draft.experience
      : (pub.journey && pub.journey.length > 0)
      ? pub.journey
      : (profile.draft?.journey && profile.draft.journey.length > 0)
      ? profile.draft.journey
      : [];

    const sortedExperience = expSource
      .filter((item) => (item.company && item.company.trim()) || (item.role && item.role.trim()) || (item.title && item.title.trim()))
      .map(normalizeExperienceItem)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const sortedJourney = sortedExperience;

    const sortedProjects = (pub.projects && pub.projects.length > 0)
      ? pub.projects.sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];
    const sortedImpactMetrics = (pub.impactMetrics && pub.impactMetrics.length > 0)
      ? pub.impactMetrics.sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];
    const sortedAchievements = (pub.achievements && pub.achievements.length > 0)
      ? pub.achievements.sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];
    const sortedMedia = (pub.mediaGallery && pub.mediaGallery.length > 0)
      ? pub.mediaGallery.filter((m) => m.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];
    const sortedBlogs = (pub.blogs && pub.blogs.length > 0)
      ? pub.blogs.filter((b) => b.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];
    const visibleSocialLinks = (pub.socialLinks || []).filter((l) => l.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0));

    // 8-Section Founder & Employee Identity Flow
    const overviewSection = {
      avatarUrl: pub.avatarUrl || '',
      coverUrl: orgCoverUrl,
      name: profile.memberId.name,
      designation: profile.memberId.designation,
      companyName: company?.name || 'OneWinq Enterprise',
      headline: pub.headline || pre.headline || '',
      badgeLabel: pre.badgeLabel || 'Verified Identity',
      stats: dynamicOverviewStats,
      qrCode: qrCodeDataUrl,
      publicUrl
    };

    const aboutSection = {
      title: pub.about?.title || `About ${firstName}`,
      introduction: introductionText,
      expertise: expertiseText || (Array.isArray(expertiseList) && expertiseList.length > 0 ? expertiseList.map(s => s.name || s).join(', ') : ''),
      expertiseText: expertiseText,
      expertiseList: expertiseList,
      experienceSummary: experienceSummaryText,
      experience: sortedExperience
    };

    const workAndImpactSection = {
      title: 'My Work',
      projects: sortedProjects,
      impact: sortedImpactMetrics
    };

    const userSlug = profile.memberId.slug || slug || 'member';
    const fallbackEmail = pub.connectAndContact?.workEmail || pub.workEmail || profile.memberId.workEmail || profile.memberId.email || 'contact@onewinq.com';
    const fallbackPhone = pub.connectAndContact?.phone || pub.phone || profile.memberId.phone || '+91 731 123 4507';

    // Prioritize user's real custom LinkedIn and Twitter from socialLinks or connectAndContact
    const userLinkedIn = pub.socialLinks?.find(s => s.platform?.toLowerCase() === 'linkedin')?.url
      || pub.connectAndContact?.linkedin
      || pub.linkedin
      || '';

    const userTwitter = pub.socialLinks?.find(s => ['twitter', 'x'].includes(s.platform?.toLowerCase()))?.url
      || pub.connectAndContact?.twitter
      || pub.twitter
      || '';

    const enrichedSocialLinks = (pub.socialLinks && pub.socialLinks.length > 0)
      ? pub.socialLinks.filter(l => l.isVisible !== false).map(l => ({ ...l.toObject?.() || l }))
      : [];

    const hasLinkedIn = enrichedSocialLinks.some(s => s.platform?.toLowerCase() === 'linkedin');
    const hasTwitter = enrichedSocialLinks.some(s => ['twitter', 'x'].includes(s.platform?.toLowerCase()));

    if (!hasLinkedIn) {
      enrichedSocialLinks.push({
        platform: 'LinkedIn',
        url: userLinkedIn || `https://linkedin.com/in/${userSlug}`,
        order: 1,
        isVisible: true
      });
    }
    if (!hasTwitter) {
      enrichedSocialLinks.push({
        platform: 'Twitter',
        url: userTwitter || `https://x.com/@${userSlug}_onewinq`,
        order: 2,
        isVisible: true
      });
    }

    const connectAndContactSection = {
      title: pub.connectAndContact?.title || "Let's Connect",
      note: pub.connectAndContact?.note || pub.collaborationNote || 'Open to collaboration, speaking opportunities and new ideas.',
      workEmail: fallbackEmail,
      phone: fallbackPhone,
      linkedin: userLinkedIn || `https://linkedin.com/in/${userSlug}`,
      twitter: userTwitter || `https://x.com/@${userSlug}_onewinq`,
      socialLinks: enrichedSocialLinks,
      ctaButtonText: pub.connectAndContact?.ctaButtonText || pre.ctaButtonText || 'Connect With Me'
    };

    return {
      // 1. Overview (Hero card with stats)
      overview: overviewSection,
      // 2. About (Introduction, Expertise, Experience)
      about: aboutSection,
      // 3. My Journey
      journey: sortedJourney,
      // 4. My Work & Impact (Projects + Impact metrics)
      workAndImpact: workAndImpactSection,
      // 5. My Achievements
      achievements: sortedAchievements,
      // 6. Media & Gallery
      mediaGallery: sortedMedia,
      // 7. Blogs & Thoughts
      blogs: sortedBlogs,
      // 8. Connect & Contact (Email, Phone, Connect With Me, Share Profile)
      connectAndContact: connectAndContactSection,

      // Flat compatibility fields for existing components and API consumers
      name: profile.memberId.name,
      designation: profile.memberId.designation,
      department: {
        _id: profile.memberId.departmentId?._id,
        name: profile.memberId.departmentId?.name || '',
        slug: profile.memberId.departmentId?.slug || '',
        description: profile.memberId.departmentId?.description || ''
      },
      role: {
        _id: profile.memberId.roleId?._id,
        name: profile.memberId.roleId?.name || '',
        slug: profile.memberId.roleId?.slug || ''
      },
      employeeId: profile.memberId.employeeId,
      companyName: company?.name || 'OneWinq Enterprise',
      slug: profile.slug,
      headline: pub.headline || pre.headline || '',
      bio: pub.bio || pre.bio || '',
      workEmail: pub.connectAndContact?.workEmail || pub.workEmail || '',
      phone: pub.connectAndContact?.phone || pub.phone || '',
      avatarUrl: pub.avatarUrl || '',
      coverUrl: orgCoverUrl,
      orgLogoUrl,
      companyBranding: company?.branding || null,
      collaborationNote: pub.connectAndContact?.note || pub.collaborationNote || pre.collaborationNote || 'Open to collaboration, speaking opportunities and new ideas.',
      ctaButtonText: pre.ctaButtonText || 'Get in Touch',
      badgeLabel: pre.badgeLabel || 'Verified Member',
      overviewStats: dynamicOverviewStats,
      location: pub.location || { city: company?.locations?.[0]?.city || 'Indore', country: company?.locations?.[0]?.country || 'India' },
      experience: sortedExperience,
      journey: sortedJourney,
      skills: (Array.isArray(pub.skills) && pub.skills.length > 0)
        ? pub.skills
        : (Array.isArray(profile.memberId?.skills) && profile.memberId.skills.length > 0)
        ? profile.memberId.skills
        : (Array.isArray(expertiseList) && expertiseList.length > 0)
        ? expertiseList
        : [],
      projects: sortedProjects,
      impactMetrics: sortedImpactMetrics,
      socialLinks: visibleSocialLinks,
      customSections: (pub.customSections || []).filter((s) => s.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)),
      template: {
        id: resolvedTemplate.key,
        key: resolvedTemplate.key,
        name: resolvedTemplate.name,
        category: resolvedTemplate.category,
        layoutConfig: resolvedTemplate.layoutConfig,
        predefinedDetails: pre,
        themeOverrides: profile.themeOverrides
      },
      qrCode: qrCodeDataUrl,
      publicUrl,
      isRedirect,
      canonicalSlug: canonicalSlug || profile.slug,
      redirectUrl: `/p/${profile.slug}`
    };
  }

  async getQrCodeForSlug(slug, format = 'dataUrl') {
    const rawIdentifier = (slug || '').trim();
    const normalizedSlug = rawIdentifier.toLowerCase();

    let profile = await EmployeeProfile.findOne({
      slug: normalizedSlug,
      visibility: 'public'
    }).lean();

    if (!profile) {
      const historyRecord = await ProfileSlugHistory.findOne({ slug: normalizedSlug }).lean();
      if (historyRecord?.profileId) {
        profile = await EmployeeProfile.findOne({ _id: historyRecord.profileId, visibility: 'public' }).lean();
      }
    }

    if (!profile) {
      const member = await TeamMember.findOne({
        employeeId: rawIdentifier.toUpperCase(),
        status: 'active'
      }).select('_id profileId').lean();

      if (member) {
        profile = await EmployeeProfile.findOne({
          $or: [{ memberId: member._id }, { _id: member.profileId }],
          visibility: 'public'
        }).lean();
      }
    }

    if (!profile) {
      throw new NotFoundError(`Profile '${slug}' not found`, ERROR_CODES.PROFILE_NOT_FOUND);
    }

    const publicUrl = `${env.PUBLIC_PROFILE_BASE_URL}/${profile.slug}`;

    if (format === 'svg') {
      return await generateQRCodeSvg(publicUrl);
    }
    return await generateQRCodeDataUrl(publicUrl);
  }
}

export const publicProfileService = new PublicProfileService();
