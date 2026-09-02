import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/user.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { hashPassword, comparePassword } from '../../utils/hash.util.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateRandomToken,
  hashToken
} from '../../utils/token.util.js';
import { UnauthorizedError, BadRequestError, ForbiddenError, NotFoundError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { emailService } from '../../integrations/email/email.service.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { env } from '../../config/env.config.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

class AuthService {
  async login({ email, password, ipAddress = '', userAgent = '' }) {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password', ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Check account lockout
    if (user.isLocked()) {
      const remainingMinutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / (1000 * 60));
      throw new ForbiddenError(
        `Account is temporarily locked due to failed login attempts. Please try again in ${remainingMinutes} minute(s).`,
        ERROR_CODES.ACCOUNT_LOCKED
      );
    }

    if (user.status === 'suspended') {
      throw new ForbiddenError('Account is suspended. Please contact organization administrator.', ERROR_CODES.ACCOUNT_SUSPENDED);
    }

    if (user.status === 'inactive') {
      throw new ForbiddenError('Account is inactive.', ERROR_CODES.ACCOUNT_INACTIVE);
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
      }
      await user.save();
      throw new UnauthorizedError('Invalid email or password', ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Reset failed attempts upon successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    user.lastLoginAt = new Date();
    user.lastLoginIp = ipAddress;

    // Generate Token Family
    const familyId = uuidv4();
    const payload = { userId: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ ...payload, familyId });

    // Store hashed refresh token
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    user.cleanupExpiredTokens();
    user.refreshTokens.push({
      tokenHash,
      familyId,
      expiresAt,
      ipAddress,
      userAgent,
      isRevoked: false
    });

    await user.save();

    // Fetch team member profile
    const member = await TeamMember.findOne({ userId: user._id, status: { $ne: 'archived' } })
      .populate('roleId')
      .populate('departmentId');

    eventBus.emitEvent(APP_EVENTS.USER_LOGGED_IN, {
      actorId: user._id,
      email: user.email,
      ipAddress,
      userAgent
    });

    const userClean = user.toObject();
    delete userClean.passwordHash;
    delete userClean.refreshTokens;

    return {
      user: userClean,
      member,
      accessToken,
      refreshToken
    };
  }

  async refreshToken({ refreshTokenString, ipAddress = '', userAgent = '' }) {
    if (!refreshTokenString) {
      throw new UnauthorizedError('Refresh token is required', ERROR_CODES.INVALID_TOKEN);
    }

    const decoded = verifyRefreshToken(refreshTokenString);
    if (!decoded || !decoded.userId || !decoded.familyId) {
      throw new UnauthorizedError('Invalid or expired refresh token', ERROR_CODES.INVALID_TOKEN);
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.status !== 'active') {
      throw new UnauthorizedError('User account not found or inactive', ERROR_CODES.UNAUTHORIZED);
    }

    const tokenHash = hashToken(refreshTokenString);
    const storedToken = user.refreshTokens.find((rt) => rt.tokenHash === tokenHash);

    // Reuse detection: if token is not found or already revoked, revoke entire family
    if (!storedToken || storedToken.isRevoked) {
      user.refreshTokens.forEach((rt) => {
        if (rt.familyId === decoded.familyId) {
          rt.isRevoked = true;
        }
      });
      await user.save();
      throw new UnauthorizedError(
        'Refresh token reuse detected. All sessions in this group have been terminated for security.',
        ERROR_CODES.TOKEN_REUSE_DETECTED
      );
    }

    // Invalidate the used refresh token (rotation)
    storedToken.isRevoked = true;

    // Issue new pair in the same token family
    const payload = { userId: user._id.toString(), email: user.email };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken({ ...payload, familyId: decoded.familyId });

    user.refreshTokens.push({
      tokenHash: hashToken(newRefreshToken),
      familyId: decoded.familyId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress,
      userAgent,
      isRevoked: false
    });

    user.cleanupExpiredTokens();
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async logout({ userId, refreshTokenString }) {
    const user = await User.findById(userId);
    if (user && refreshTokenString) {
      const tokenHash = hashToken(refreshTokenString);
      const tokenDoc = user.refreshTokens.find((rt) => rt.tokenHash === tokenHash);
      if (tokenDoc) {
        tokenDoc.isRevoked = true;
      }
      user.cleanupExpiredTokens();
      await user.save();
    }
    return { message: 'Logged out successfully' };
  }

  async forgotPassword({ email, ipAddress }) {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always return success message to avoid account enumeration
    if (!user) {
      return { message: 'If that email address is registered, a password reset link has been sent.' };
    }

    const resetToken = generateRandomToken(32);
    user.passwordResetTokenHash = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail({
      to: user.email,
      resetLink
    });

    eventBus.emitEvent(APP_EVENTS.USER_PASSWORD_RESET_REQUESTED, {
      actorId: user._id,
      email: user.email,
      ipAddress
    });

    return { message: 'If that email address is registered, a password reset link has been sent.' };
  }

  async resetPassword({ token, newPassword, ipAddress }) {
    const tokenHash = hashToken(token);
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: { $gt: new Date() }
    }).select('+passwordHash');

    if (!user) {
      throw new BadRequestError('Password reset token is invalid or has expired', ERROR_CODES.PASSWORD_RESET_TOKEN_INVALID);
    }

    user.passwordHash = await hashPassword(newPassword);
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    // Revoke all existing refresh tokens
    user.refreshTokens.forEach((rt) => (rt.isRevoked = true));
    await user.save();

    eventBus.emitEvent(APP_EVENTS.USER_PASSWORD_RESET, {
      actorId: user._id,
      email: user.email,
      ipAddress
    });

    return { message: 'Password has been successfully reset. Please log in with your new password.' };
  }

  async changePassword({ userId, currentPassword, newPassword }) {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestError('Current password does not match', ERROR_CODES.INVALID_CREDENTIALS);
    }

    user.passwordHash = await hashPassword(newPassword);
    // Revoke other active refresh tokens
    user.refreshTokens.forEach((rt) => (rt.isRevoked = true));
    await user.save();

    return { message: 'Password updated successfully' };
  }
}

export const authService = new AuthService();
