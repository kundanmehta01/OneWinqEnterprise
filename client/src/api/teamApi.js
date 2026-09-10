import api from './axios';

export const teamApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/admin/team', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/admin/team/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/admin/team', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/team/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/admin/team/${id}`);
    return res.data;
  }
};
