import api from './axios';

export const templateApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/admin/templates', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/admin/templates/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/admin/templates', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/templates/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/admin/templates/${id}`);
    return res.data;
  }
};
