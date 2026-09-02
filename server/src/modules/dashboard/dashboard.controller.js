import { dashboardService } from './dashboard.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class DashboardController {
  async getDashboardSummary(req, res, next) {
    try {
      const summary = await dashboardService.getExecutiveDashboard();
      return ApiResponse.success(res, { data: summary });
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
