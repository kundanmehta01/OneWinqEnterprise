import api from './axios';

export const analyticsApi = {
  getMetrics: async (params = {}) => {
    const res = await api.get('/admin/analytics', { params });
    return res.data;
  }
};
