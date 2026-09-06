import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const analyticsService = {
  getAggregatedMetrics: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.ANALYTICS, { params });
    return res.data.data;
  }
};
