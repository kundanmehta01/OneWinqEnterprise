import { OrganizationSettings } from './organizationSettings.model.js';
import { Template } from '../templates/template.model.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';

class SettingsService {
  async getSettings() {
    let settings = await OrganizationSettings.findOne().populate('profileSettings.defaultTemplateId').lean();
    if (!settings) {
      const defaultTemplate = await Template.findOne({ isDefault: true }).lean();
      settings = await OrganizationSettings.create({
        organizationName: 'OneWinq',
        profileSettings: {
          defaultTemplateId: defaultTemplate ? defaultTemplate._id : null
        }
      });
    }
    return settings;
  }

  async updateSettings(updateData, actorContext = {}) {
    let settings = await OrganizationSettings.findOne();
    if (!settings) {
      settings = new OrganizationSettings();
    }

    const previousValue = settings.toObject();

    if (updateData.organizationName !== undefined) settings.organizationName = updateData.organizationName;
    if (updateData.timezone !== undefined) settings.timezone = updateData.timezone;
    if (updateData.language !== undefined) settings.language = updateData.language;

    if (updateData.profileSettings) {
      settings.profileSettings = { ...settings.profileSettings, ...updateData.profileSettings };
    }

    if (updateData.securitySettings) {
      settings.securitySettings = { ...settings.securitySettings, ...updateData.securitySettings };
    }

    settings.lastUpdatedBy = actorContext.actorId;
    await settings.save();

    eventBus.emitEvent(APP_EVENTS.SETTINGS_UPDATED, {
      actorId: actorContext.actorId,
      resourceId: settings._id,
      previousValue,
      newValue: settings.toObject(),
      context: actorContext
    });

    return settings;
  }
}

export const settingsService = new SettingsService();
