import api from './axios';

export const userDashboardApi = {
  getHome: async () => {
    const res = await api.get('/me/home');
    return res.data || res;
  }
};
