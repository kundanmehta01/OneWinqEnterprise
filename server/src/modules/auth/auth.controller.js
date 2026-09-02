import { authService } from './auth.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const ipAddress = req.auditContext?.ipAddress || req.ip;
      const userAgent = req.auditContext?.userAgent || req.headers['user-agent'];

      const result = await authService.login({ email, password, ipAddress, userAgent });

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return ApiResponse.success(res, {
        message: 'Login successful',
        data: {
          user: result.user,
          member: result.member,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const refreshTokenString = req.body.refreshToken || req.cookies?.refreshToken;
      const ipAddress = req.auditContext?.ipAddress || req.ip;
      const userAgent = req.auditContext?.userAgent || req.headers['user-agent'];

      const tokens = await authService.refreshToken({ refreshTokenString, ipAddress, userAgent });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return ApiResponse.success(res, {
        message: 'Token refreshed successfully',
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshTokenString = req.body?.refreshToken || req.cookies?.refreshToken;
      await authService.logout({ userId: req.user._id, refreshTokenString });

      res.clearCookie('refreshToken');

      return ApiResponse.success(res, {
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const ipAddress = req.auditContext?.ipAddress || req.ip;
      const result = await authService.forgotPassword({ email, ipAddress });
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const ipAddress = req.auditContext?.ipAddress || req.ip;
      const result = await authService.resetPassword({ token, newPassword, ipAddress });
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword({
        userId: req.user._id,
        currentPassword,
        newPassword
      });
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = req.user.toObject();
      delete user.passwordHash;
      delete user.refreshTokens;

      return ApiResponse.success(res, {
        data: {
          user,
          member: req.member,
          role: req.roleName,
          isSuperAdmin: req.isSuperAdmin,
          permissions: req.permissions
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
