import { userDashboardService } from './userDashboard.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class UserDashboardController {
  async getDashboard(req, res, next) {
    try {
      const data = await userDashboardService.getUserHome(req.user._id);
      return ApiResponse.success(res, { data });
    } catch (error) {
      next(error);
    }
  }
}

export const userDashboardController = new UserDashboardController();
