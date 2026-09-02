import { analyticsService } from './analytics.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class AnalyticsController {
  async getMetrics(req, res, next) {
    try {
      const { range, startDate, endDate, targetId, targetType } = req.query;
      const metrics = await analyticsService.getAggregatedMetrics({
        range,
        startDate,
        endDate,
        targetId,
        targetType
      });
      return ApiResponse.success(res, { data: metrics });
    } catch (error) {
      next(error);
    }
  }

  async getMyProfileMetrics(req, res, next) {
    try {
      const { range, startDate, endDate } = req.query;
      const memberId = req.member?._id;
      if (!memberId) {
        return ApiResponse.success(res, {
          data: {
            kpis: { totalViews: 0, totalShares: 0, totalQrScans: 0, totalLinkClicks: 0, totalContactClicks: 0 },
            trends: []
          }
        });
      }
      const metrics = await analyticsService.getAggregatedMetrics({
        range,
        startDate,
        endDate,
        targetId: memberId,
        targetType: 'EMPLOYEE'
      });
      return ApiResponse.success(res, { data: metrics });
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
