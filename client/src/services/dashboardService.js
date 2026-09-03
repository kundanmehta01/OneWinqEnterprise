import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const dashboardService = {
  getExecutiveDashboard: async () => {
    const res = await api.get(ENDPOINTS.ADMIN.DASHBOARD);
    return res.data.data;
  }
};
