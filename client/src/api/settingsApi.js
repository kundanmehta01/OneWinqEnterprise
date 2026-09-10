import api from './axios';

export const settingsApi = {
  getSettings: async () => {
    const res = await api.get('/admin/settings');
    return res.data;
  },
  updateSettings: async (data) => {
    const res = await api.put('/admin/settings', data);
    return res.data;
  }
};
