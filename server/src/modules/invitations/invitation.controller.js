import { invitationService } from './invitation.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class InvitationController {
  async getAllInvitations(req, res, next) {
    try {
      const result = await invitationService.getAllInvitations(req.query);
      return ApiResponse.paginated(res, {
        data: result.invitations,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getInvitationById(req, res, next) {
    try {
      const invitation = await invitationService.getInvitationById(req.params.id);
      return ApiResponse.success(res, { data: invitation });
    } catch (error) {
      next(error);
    }
  }

  async createInvitation(req, res, next) {
    try {
      const inviterContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const invitation = await invitationService.createInvitation(req.body, inviterContext);
      return ApiResponse.created(res, {
        message: `Invitation successfully sent to ${req.body.email}`,
        data: invitation
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyToken(req, res, next) {
    try {
      const token = req.query.token;
      if (!token) {
        return ApiResponse.error(res, { statusCode: 400, message: 'Token parameter is required' });
      }
      const data = await invitationService.verifyInvitationToken(token);
      return ApiResponse.success(res, { data });
    } catch (error) {
      next(error);
    }
  }

  async acceptInvitation(req, res, next) {
    try {
      const { token, password, name } = req.body;
      const ipAddress = req.auditContext?.ipAddress || req.ip;
      const userAgent = req.auditContext?.userAgent || req.headers['user-agent'];

      const result = await invitationService.acceptInvitation({
        token,
        password,
        name,
        ipAddress,
        userAgent
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return ApiResponse.created(res, {
        message: 'Account activated successfully. Welcome to OneWinq!',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async resendInvitation(req, res, next) {
    try {
      const inviterContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const result = await invitationService.resendInvitation(req.params.id, inviterContext);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async cancelInvitation(req, res, next) {
    try {
      const inviterContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const result = await invitationService.cancelInvitation(req.params.id, inviterContext);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const invitationController = new InvitationController();
