import { userDirectoryService } from './userDirectory.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class UserDirectoryController {
  async getDepartments(req, res, next) {
    try {
      const departments = await userDirectoryService.getDepartments();
      return ApiResponse.success(res, { data: { departments } });
    } catch (error) {
      next(error);
    }
  }

  async getDepartmentById(req, res, next) {
    try {
      const result = await userDirectoryService.getDepartmentById(req.params.id);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  async getTeamDirectory(req, res, next) {
    try {
      const result = await userDirectoryService.getTeamDirectory(req.query);
      return ApiResponse.success(res, { data: result });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyOverview(req, res, next) {
    try {
      const company = await userDirectoryService.getCompanyOverview();
      return ApiResponse.success(res, { data: company });
    } catch (error) {
      next(error);
    }
  }
}

export const userDirectoryController = new UserDirectoryController();
