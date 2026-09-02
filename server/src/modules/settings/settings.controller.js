import { settingsService } from './settings.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class SettingsController {
  async getSettings(req, res, next) {
    try {
      const settings = await settingsService.getSettings();
      return ApiResponse.success(res, { data: settings });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const settings = await settingsService.updateSettings(req.body, actorContext);
      return ApiResponse.success(res, {
        message: 'Settings updated successfully',
        data: settings
      });
    } catch (error) {
      next(error);
    }
  }
}

export const settingsController = new SettingsController();
