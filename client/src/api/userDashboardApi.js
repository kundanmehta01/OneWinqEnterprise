import api from './axios';

export const userDashboardApi = {
  getHome: async () => {
    const res = await api.get('/me/dashboard');
    return res.data || res;
  }
};
