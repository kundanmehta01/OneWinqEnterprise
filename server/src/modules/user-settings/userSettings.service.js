import { UserSettings } from './userSettings.model.js';
import { User } from '../users/user.model.js';
import { hashToken } from '../../utils/token.util.js';

class UserSettingsService {
  async getSettings(userId) {
    let settings = await UserSettings.findOne({ userId }).lean();
    if (!settings) {
      settings = await UserSettings.create({ userId });
      settings = settings.toObject();
    }
    return settings;
  }

  async updateSettings(userId, updateData) {
    let settings = await UserSettings.findOne({ userId });
    if (!settings) {
      settings = new UserSettings({ userId });
    }

    if (updateData.privacy) {
      settings.privacy = { ...settings.privacy.toObject(), ...updateData.privacy };
    }
    if (updateData.notifications) {
      settings.notifications = { ...settings.notifications.toObject(), ...updateData.notifications };
    }

    await settings.save();
    return settings;
  }

  async getActiveSessions(userId) {
    const user = await User.findById(userId).lean();
    if (!user || !user.refreshTokens) {
      return [];
    }

    const now = new Date();
    const activeSessions = user.refreshTokens
      .filter((t) => !t.isRevoked && new Date(t.expiresAt) > now)
      .map((t) => ({
        familyId: t.familyId,
        ipAddress: t.ipAddress || 'Unknown IP',
        userAgent: t.userAgent || 'Unknown Device',
        createdAt: t.createdAt,
        expiresAt: t.expiresAt
      }));

    return activeSessions;
  }

  async logoutAllOtherSessions(userId, currentRefreshTokenString = '') {
    const user = await User.findById(userId);
    if (!user || !user.refreshTokens) {
      return { message: 'All other sessions terminated successfully.' };
    }

    const currentHash = currentRefreshTokenString ? hashToken(currentRefreshTokenString) : '';

    user.refreshTokens.forEach((t) => {
      if (t.tokenHash !== currentHash) {
        t.isRevoked = true;
      }
    });

    await user.save();
    return { message: 'All other active sessions have been logged out.' };
  }
}

export const userSettingsService = new UserSettingsService();
