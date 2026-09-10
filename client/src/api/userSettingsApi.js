import api from './axios';

export const userSettingsApi = {
  getSettings: async () => {
    const res = await api.get('/me/settings');
    return res.data;
  },
  updateSettings: async (data) => {
    const res = await api.patch('/me/settings', data);
    return res.data;
  },
  getActiveSessions: async () => {
    const res = await api.get('/me/settings/sessions');
    return res.data;
  },
  logoutAllOtherSessions: async () => {
    const res = await api.post('/me/settings/logout-all');
    return res.data;
  }
};
