import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { templateResolverService } from '../templates/templateResolver.service.js';
import { CompanyProfile } from '../company-profile/companyProfile.model.js';
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

    return {
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
      collaborationNote: pub.collaborationNote || pre.collaborationNote || '',
      ctaButtonText: pre.ctaButtonText || 'Get in Touch',
      badgeLabel: pre.badgeLabel || '',
      overviewStats: pub.overviewStats || {
        connectionsCount: '248+',
        projectsCount: '25+',
        yearsOfExperience: '8+',
        servicesCount: '5+'
      },
      location: pub.location || {},
      experience: (pub.experience || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      journey: (pub.journey || []).filter((j) => j.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0)),
      skills: profileSkills.sort((a, b) => (a.order || 0) - (b.order || 0)),
      projects: (pub.projects || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      impactMetrics: (pub.impactMetrics || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      achievements: (pub.achievements || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      mediaGallery: (pub.mediaGallery || []).filter((m) => m.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0)),
      blogs: (pub.blogs || []).filter((b) => b.isVisible !== false).sort((a, b) => (a.order || 0) - (b.order || 0)),
      socialLinks: (pub.socialLinks || []).filter((l) => l.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)),
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
