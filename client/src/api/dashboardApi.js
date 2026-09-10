import api from './axios';

export const dashboardApi = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  }
};
