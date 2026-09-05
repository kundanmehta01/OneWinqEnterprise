import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const departmentService = {
  getAll: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.DEPARTMENTS, { params });
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`${ENDPOINTS.ADMIN.DEPARTMENTS}/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await api.post(ENDPOINTS.ADMIN.DEPARTMENTS, data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await api.patch(`${ENDPOINTS.ADMIN.DEPARTMENTS}/${id}`, data);
    return res.data.data;
  },

  delete: async (id) => {
    const res = await api.delete(`${ENDPOINTS.ADMIN.DEPARTMENTS}/${id}`);
    return res.data;
  }
};
