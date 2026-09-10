import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const teamMemberService = {
  getAll: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.TEAM, { params });
    return {
      members: res.data.data,
      pagination: res.data.pagination
    };
  },

  getById: async (id) => {
    const res = await api.get(`${ENDPOINTS.ADMIN.TEAM}/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await api.post(ENDPOINTS.ADMIN.TEAM, data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await api.patch(`${ENDPOINTS.ADMIN.TEAM}/${id}`, data);
    return res.data.data;
  },

  archive: async (id) => {
    const res = await api.delete(`${ENDPOINTS.ADMIN.TEAM}/${id}`);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`${ENDPOINTS.ADMIN.TEAM}/${id}`);
    return res.data;
  },

  restore: async (id) => {
    const res = await api.post(`${ENDPOINTS.ADMIN.TEAM}/${id}/restore`);
    return res.data.data;
  }
};
