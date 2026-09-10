import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const settingsService = {
  getSettings: async () => {
    const res = await api.get(ENDPOINTS.ADMIN.SETTINGS);
    return res.data.data;
  },

  updateSettings: async (data) => {
    const res = await api.patch(ENDPOINTS.ADMIN.SETTINGS, data);
    return res.data.data;
  }
};
