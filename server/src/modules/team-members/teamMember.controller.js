import { teamMemberService } from './teamMember.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class TeamMemberController {
  async getAllTeamMembers(req, res, next) {
    try {
      const result = await teamMemberService.getAllTeamMembers(req.query);
      return ApiResponse.paginated(res, {
        data: result.members,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getTeamMemberById(req, res, next) {
    try {
      const member = await teamMemberService.getTeamMemberById(req.params.id);
      return ApiResponse.success(res, { data: member });
    } catch (error) {
      next(error);
    }
  }

  async createTeamMember(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const result = await teamMemberService.createTeamMember(req.body, actorContext);
      return ApiResponse.created(res, {
        message: 'Team member created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTeamMember(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const member = await teamMemberService.updateTeamMember(req.params.id, req.body, actorContext);
      return ApiResponse.success(res, {
        message: 'Team member updated successfully',
        data: member
      });
    } catch (error) {
      next(error);
    }
  }

  async getDeletedTeamMembers(req, res, next) {
    try {
      const result = await teamMemberService.getDeletedTeamMembers(req.query);
      return ApiResponse.paginated(res, {
        message: 'Past / deleted team members retrieved successfully',
        data: result.members,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTeamMember(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const reason = req.body?.reason || req.query?.reason || '';
      const result = await teamMemberService.deleteTeamMember(req.params.id, actorContext, reason);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async archiveTeamMember(req, res, next) {
    return this.deleteTeamMember(req, res, next);
  }

  async restoreTeamMember(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const member = await teamMemberService.restoreTeamMember(req.params.id, actorContext);
      return ApiResponse.success(res, {
        message: 'Team member restored successfully',
        data: member
      });
    } catch (error) {
      next(error);
    }
  }
}

export const teamMemberController = new TeamMemberController();
