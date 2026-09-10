import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const companyProfileService = {
  getAdminProfile: async () => {
    const res = await api.get(ENDPOINTS.ADMIN.COMPANY_PROFILE);
    return res.data.data;
  },

  updateAdminProfile: async (data) => {
    const res = await api.patch(ENDPOINTS.ADMIN.COMPANY_PROFILE, data);
    return res.data.data;
  },

  getPublicProfile: async () => {
    const res = await api.get(ENDPOINTS.PUBLIC.COMPANY);
    return res.data.data;
  },

  // Aliases for compatibility
  get: async () => {
    const res = await api.get(ENDPOINTS.ADMIN.COMPANY_PROFILE);
    return res.data.data;
  },

  update: async (data) => {
    const res = await api.patch(ENDPOINTS.ADMIN.COMPANY_PROFILE, data);
    return res.data.data;
  }
};
