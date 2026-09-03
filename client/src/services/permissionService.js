import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const permissionService = {
  getAll: async () => {
    const res = await api.get(ENDPOINTS.ADMIN.PERMISSIONS);
    return res.data.data;
  },

  getByModule: async () => {
    const res = await api.get(ENDPOINTS.ADMIN.PERMISSIONS_BY_MODULE);
    return res.data.data;
  }
};
