import { employeeProfileService } from './employeeProfile.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class EmployeeProfileController {
  async getMyProfile(req, res, next) {
    try {
      const profile = await employeeProfileService.getProfileByUserId(req.user._id);
      return ApiResponse.success(res, { data: profile });
    } catch (error) {
      next(error);
    }
  }

  async updateMyDraftProfile(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const profile = await employeeProfileService.updateDraftProfile(req.user._id, req.body, actorContext);
      return ApiResponse.success(res, {
        message: 'Draft profile saved successfully',
        data: profile
      });
    } catch (error) {
      next(error);
    }
  }

  async submitMyProfile(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const result = await employeeProfileService.submitDraftForApproval(req.user._id, req.body?.note, actorContext);
      return ApiResponse.success(res, {
        message: result.message,
        data: {
          approvalId: result.approvalId,
          diffSummary: result.diffSummary
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyApprovalStatus(req, res, next) {
    try {
      const status = await employeeProfileService.getApprovalStatus(req.user._id);
      return ApiResponse.success(res, { data: status });
    } catch (error) {
      next(error);
    }
  }

  async getMemberProfileById(req, res, next) {
    try {
      const profile = await employeeProfileService.getProfileByMemberId(req.params.memberId);
      return ApiResponse.success(res, { data: profile });
    } catch (error) {
      next(error);
    }
  }
}

export const employeeProfileController = new EmployeeProfileController();
