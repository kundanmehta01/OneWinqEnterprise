import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const roleService = {
  getAll: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.ROLES, { params });
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`${ENDPOINTS.ADMIN.ROLES}/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await api.post(ENDPOINTS.ADMIN.ROLES, data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await api.patch(`${ENDPOINTS.ADMIN.ROLES}/${id}`, data);
    return res.data.data;
  },

  delete: async (id) => {
    const res = await api.delete(`${ENDPOINTS.ADMIN.ROLES}/${id}`);
    return res.data;
  }
};
