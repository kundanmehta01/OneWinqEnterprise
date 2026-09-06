import { userSettingsService } from './userSettings.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class UserSettingsController {
  async getSettings(req, res, next) {
    try {
      const settings = await userSettingsService.getSettings(req.user._id);
      return ApiResponse.success(res, { data: settings });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const settings = await userSettingsService.updateSettings(req.user._id, req.body);
      return ApiResponse.success(res, {
        message: 'Settings updated successfully',
        data: settings
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveSessions(req, res, next) {
    try {
      const sessions = await userSettingsService.getActiveSessions(req.user._id);
      return ApiResponse.success(res, { data: { sessions } });
    } catch (error) {
      next(error);
    }
  }

  async logoutAllOtherSessions(req, res, next) {
    try {
      const currentToken = req.body.refreshToken || req.cookies?.refreshToken;
      const result = await userSettingsService.logoutAllOtherSessions(req.user._id, currentToken);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const userSettingsController = new UserSettingsController();
