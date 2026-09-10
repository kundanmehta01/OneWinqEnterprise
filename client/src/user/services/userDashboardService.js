import api from '../../services/api';

export const userDashboardService = {
  getDashboard: async () => {
    try {
      const res = await api.get('/me/home');
      return res.data.data;
    } catch {
      // Fallback to /me/dashboard if alias
      const res = await api.get('/me/dashboard');
      return res.data.data;
    }
  },

  getDashboardData: async () => {
    return userDashboardService.getDashboard();
  }
};
