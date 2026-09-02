import { companyProfileService } from './companyProfile.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class CompanyProfileController {
  async getProfile(req, res, next) {
    try {
      const profile = await companyProfileService.getCompanyProfile();
      return ApiResponse.success(res, { data: profile });
    } catch (error) {
      next(error);
    }
  }

  async getPublicProfile(req, res, next) {
    try {
      const profile = await companyProfileService.getPublicCompanyProfile();
      if (!profile) {
        return ApiResponse.error(res, {
          statusCode: 404,
          message: 'Company profile is currently not public.'
        });
      }
      return ApiResponse.success(res, { data: profile });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const profile = await companyProfileService.updateCompanyProfile(req.body, actorContext);
      return ApiResponse.success(res, {
        message: 'Company profile updated successfully',
        data: profile
      });
    } catch (error) {
      next(error);
    }
  }
}

export const companyProfileController = new CompanyProfileController();
