import api from '../../services/api';

export const userSettingsService = {
  getSettings: async () => {
    const res = await api.get('/me/settings');
    return res.data.data;
  },

  updateSettings: async (payload) => {
    const res = await api.patch('/me/settings', payload);
    return res.data.data;
  },

  getActiveSessions: async () => {
    const res = await api.get('/me/settings/sessions');
    return res.data.data;
  },

  logoutAllOtherSessions: async () => {
    const res = await api.post('/me/settings/logout-all');
    return res.data;
  }
};
