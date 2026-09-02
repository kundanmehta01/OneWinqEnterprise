import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { Template } from '../templates/template.model.js';
import { generateQRCodeDataUrl, generateQRCodeSvg } from '../../utils/qrCode.util.js';
import { NotFoundError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { env } from '../../config/env.config.js';

class PublicProfileService {
  async getPublicProfileBySlug(slug, clientContext = {}) {
    const profile = await EmployeeProfile.findOne({
      slug: slug.toLowerCase(),
      visibility: 'public'
    })
      .populate({
        path: 'memberId',
        match: { status: 'active', isArchived: false },
        select: 'name employeeId designation departmentId joiningDate',
        populate: { path: 'departmentId', select: 'name slug' }
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

    // Format public-ready profile object
    const pub = profile.published || {};

    return {
      name: profile.memberId.name,
      designation: profile.memberId.designation,
      department: profile.memberId.departmentId?.name || '',
      employeeId: profile.memberId.employeeId,
      slug: profile.slug,
      headline: pub.headline || '',
      bio: pub.bio || '',
      workEmail: pub.workEmail || '',
      phone: pub.phone || '',
      avatarUrl: pub.avatarUrl || '',
      coverUrl: pub.coverUrl || '',
      location: pub.location || {},
      experience: (pub.experience || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      skills: (pub.skills || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      projects: (pub.projects || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      achievements: (pub.achievements || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
      socialLinks: (pub.socialLinks || []).filter((l) => l.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)),
      customSections: (pub.customSections || []).filter((s) => s.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0)),
      template: {
        category: profile.templateId?.category,
        layoutConfig: profile.templateId?.layoutConfig,
        themeOverrides: profile.themeOverrides,
        sectionOrder: profile.templateId?.sectionOrder
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
