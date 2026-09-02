import { profileApprovalService } from './profileApproval.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class ProfileApprovalController {
  async getAllApprovals(req, res, next) {
    try {
      const result = await profileApprovalService.getAllApprovals(req.query);
      return ApiResponse.paginated(res, {
        data: result.approvals,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getApprovalById(req, res, next) {
    try {
      const approval = await profileApprovalService.getApprovalById(req.params.id);
      return ApiResponse.success(res, { data: approval });
    } catch (error) {
      next(error);
    }
  }

  async reviewApproval(req, res, next) {
    try {
      const reviewerContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const result = await profileApprovalService.reviewApproval(req.params.id, req.body, reviewerContext);
      return ApiResponse.success(res, {
        message: `Profile changes have been ${req.body.action === 'request_changes' ? 'marked with changes requested' : req.body.action + 'd'} successfully`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export const profileApprovalController = new ProfileApprovalController();
