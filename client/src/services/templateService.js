import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const templateService = {
  getAll: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.TEMPLATES, { params });
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`${ENDPOINTS.ADMIN.TEMPLATES}/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await api.post(ENDPOINTS.ADMIN.TEMPLATES, data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await api.patch(`${ENDPOINTS.ADMIN.TEMPLATES}/${id}`, data);
    return res.data.data;
  },

  duplicate: async (id, data = {}) => {
    const res = await api.post(`${ENDPOINTS.ADMIN.TEMPLATES}/${id}/duplicate`, data);
    return res.data.data;
  },

  archive: async (id) => {
    const res = await api.delete(`${ENDPOINTS.ADMIN.TEMPLATES}/${id}`);
    return res.data;
  }
};
