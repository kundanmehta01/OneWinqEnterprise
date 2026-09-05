import { CompanyProfile } from './companyProfile.model.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';

class CompanyProfileService {
  async getCompanyProfile() {
    let profile = await CompanyProfile.findOne().lean();
    if (!profile) {
      profile = await CompanyProfile.create({
        name: 'OneWinq',
        slug: 'onewinq'
      });
    }
    return profile;
  }

  async getPublicCompanyProfile() {
    let profile = await CompanyProfile.findOne({ isPublic: true }).lean();
    if (!profile) {
      return null;
    }

    // Filter only visible dynamic sections, navigation items, social links, products, projects, achievements, media
    const visibleSections = (profile.dynamicSections || [])
      .filter((s) => s.isVisible)
      .sort((a, b) => a.order - b.order);

    const visibleNav = (profile.navigation || [])
      .filter((n) => n.isVisible)
      .sort((a, b) => a.order - b.order);

    const visibleSocial = (profile.socialLinks || [])
      .filter((l) => l.isVisible)
      .sort((a, b) => a.order - b.order);

    const visibleProducts = (profile.productsServices || [])
      .filter((p) => p.isVisible)
      .sort((a, b) => a.order - b.order);

    const visibleProjects = (profile.projects || [])
      .filter((p) => p.isVisible)
      .sort((a, b) => a.order - b.order);

    const visibleAchievements = (profile.achievements || [])
      .filter((a) => a.isVisible)
      .sort((a, b) => a.order - b.order);

    const visibleMedia = (profile.mediaGallery || [])
      .filter((m) => m.isVisible)
      .sort((a, b) => a.order - b.order);

    return {
      name: profile.name,
      slug: profile.slug,
      tagline: profile.tagline,
      description: profile.description,
      industry: profile.industry,
      website: profile.website,
      overviewStats: profile.overviewStats || {
        foundedYear: '2024',
        locationShort: '',
        teamSize: '',
        customMetrics: []
      },
      location: profile.location,
      contact: profile.contact,
      about: profile.about,
      productsServices: visibleProducts,
      projects: visibleProjects,
      achievements: visibleAchievements,
      mediaGallery: visibleMedia,
      branding: profile.branding,
      dynamicSections: visibleSections,
      navigation: visibleNav,
      socialLinks: visibleSocial,
      updatedAt: profile.updatedAt
    };
  }

  async updateCompanyProfile(updateData, actorContext = {}) {
    let profile = await CompanyProfile.findOne();
    if (!profile) {
      profile = new CompanyProfile({ name: 'OneWinq', slug: 'onewinq' });
    }

    const previousValue = profile.toObject();

    if (updateData.name !== undefined) profile.name = updateData.name;
    if (updateData.tagline !== undefined) profile.tagline = updateData.tagline;
    if (updateData.description !== undefined) profile.description = updateData.description;
    if (updateData.industry !== undefined) profile.industry = updateData.industry;
    if (updateData.website !== undefined) profile.website = updateData.website;
    if (updateData.overviewStats) profile.overviewStats = { ...profile.overviewStats, ...updateData.overviewStats };
    if (updateData.location) profile.location = { ...profile.location, ...updateData.location };
    if (updateData.contact) profile.contact = { ...profile.contact, ...updateData.contact };
    if (updateData.about) profile.about = { ...profile.about, ...updateData.about };
    if (updateData.productsServices !== undefined) profile.productsServices = updateData.productsServices;
    if (updateData.projects !== undefined) profile.projects = updateData.projects;
    if (updateData.achievements !== undefined) profile.achievements = updateData.achievements;
    if (updateData.mediaGallery !== undefined) profile.mediaGallery = updateData.mediaGallery;
    if (updateData.branding) profile.branding = { ...profile.branding, ...updateData.branding };
    if (updateData.dynamicSections) profile.dynamicSections = updateData.dynamicSections;
    if (updateData.navigation) profile.navigation = updateData.navigation;
    if (updateData.socialLinks) profile.socialLinks = updateData.socialLinks;
    if (updateData.isPublic !== undefined) profile.isPublic = updateData.isPublic;

    profile.lastUpdatedBy = actorContext.actorId;
    await profile.save();

    eventBus.emitEvent(APP_EVENTS.COMPANY_PROFILE_UPDATED, {
      actorId: actorContext.actorId,
      resourceId: profile._id,
      previousValue,
      newValue: profile.toObject(),
      context: actorContext
    });

    return profile;
  }
}

export const companyProfileService = new CompanyProfileService();
