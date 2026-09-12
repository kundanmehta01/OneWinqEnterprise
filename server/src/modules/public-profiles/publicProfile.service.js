import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
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
    const profile = await EmployeeProfile.findOne({
      slug: slug.toLowerCase(),
      visibility: 'public'
    })
      .populate({
        path: 'memberId',
        match: { status: 'active', isArchived: false },
        select: 'name employeeId designation departmentId roleId joiningDate',
        populate: [
          { path: 'departmentId', select: 'name slug description templateId', populate: { path: 'templateId' } },
          { path: 'roleId', select: 'name slug permissions isSystem' }
        ]
      })
      .populate('templateId')
      .lean();

    if (!profile || !profile.memberId) {
      throw new NotFoundError(`Public profile '${slug}' not found or is private.`, ERROR_CODES.PROFILE_NOT_FOUND);
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

    // Resolve dynamic profile template based on cascading priority (Role -> Department -> Fallback)
    const resolvedTemplate = await templateResolverService.resolveTemplateForMember({
      role: profile.memberId.roleId,
      department: profile.memberId.departmentId,
      designation: profile.memberId.designation
    });

    const pub = profile.published || profile.draft || {};
    const pre = resolvedTemplate.predefinedDetails || {};

    const profileSkills = (pub.skills && pub.skills.length > 0)
      ? pub.skills
      : (pre.skills || []).map((s, idx) => ({ name: s, order: idx }));

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
    const realSkillsCount = (pub.skills || profileSkills || []).length;

    // User-entered overviewStats values take precedence if provided
    const connectionsVal = pub.overviewStats?.connectionsCount || pub.overviewStats?.connections
      || (realConnections > 0 ? `${realConnections}+` : (tapCount > 0 ? `${tapCount}+` : '0'));

    const projectsVal = pub.overviewStats?.projectsCount || pub.overviewStats?.projects
      || (realProjectsCount > 0 ? `${realProjectsCount}+` : '0');

    const yearsVal = pub.overviewStats?.yearsOfExperience || pub.overviewStats?.years
      || (realYears > 0 ? `${realYears}+` : '0');

    const servicesVal = pub.overviewStats?.servicesCount || pub.overviewStats?.services
      || (realSkillsCount > 0 ? `${realSkillsCount}+` : '0');

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
    const sortedSkills = profileSkills.sort((a, b) => (a.order || 0) - (b.order || 0));
    const expertiseList = (pub.about?.expertise && pub.about.expertise.length > 0)
      ? pub.about.expertise
      : sortedSkills.map(s => s.name || s);
    const experienceSummaryText = pub.about?.experienceSummary
      || `${dynamicOverviewStats.years || '5+'} in ${profile.memberId.departmentId?.name || 'Enterprise'} & ${profile.memberId.designation}.`;

    const sortedJourney = (pub.journey && pub.journey.length > 0)
      ? pub.journey.filter((j) => j.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0))
      : [];
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
      expertise: expertiseList,
      experienceSummary: experienceSummaryText,
      experience: (pub.experience || []).sort((a, b) => (a.order || 0) - (b.order || 0))
    };

    const workAndImpactSection = {
      title: 'My Work & Impact',
      projects: sortedProjects,
      impact: sortedImpactMetrics
    };

    const connectAndContactSection = {
      title: pub.connectAndContact?.title || "Let's Connect",
      note: pub.connectAndContact?.note || pub.collaborationNote || 'Open for collaboration, speaking opportunities and new ideas.',
      workEmail: pub.connectAndContact?.workEmail || pub.workEmail || '',
      phone: pub.connectAndContact?.phone || pub.phone || '',
      socialLinks: visibleSocialLinks,
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
      workEmail: pub.workEmail || '',
      phone: pub.phone || '',
      avatarUrl: pub.avatarUrl || '',
      coverUrl: orgCoverUrl,
      orgLogoUrl,
      companyBranding: company?.branding || null,
      collaborationNote: pub.collaborationNote || pre.collaborationNote || 'Open for collaboration, professional networking and exciting opportunities.',
      ctaButtonText: pre.ctaButtonText || 'Get in Touch',
      badgeLabel: pre.badgeLabel || 'Verified Member',
      overviewStats: dynamicOverviewStats,
      location: pub.location || { city: company?.locations?.[0]?.city || 'Indore', country: company?.locations?.[0]?.country || 'India' },
      experience: (pub.experience || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      skills: sortedSkills,
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
      publicUrl
    };
  }

  async getQrCodeForSlug(slug, format = 'dataUrl') {
    const profile = await EmployeeProfile.findOne({
      slug: slug.toLowerCase(),
      visibility: 'public'
    }).lean();

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
