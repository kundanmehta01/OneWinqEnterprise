import api from './axios';

export const roleApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/admin/roles', { params });
    return res?.data !== undefined ? res.data : res;
  },
  getPermissions: async () => {
    const res = await api.get('/admin/permissions');
    return res?.data !== undefined ? res.data : res;
  },
  getById: async (id) => {
    const res = await api.get(`/admin/roles/${id}`);
    return res?.data !== undefined ? res.data : res;
  },
  create: async (data) => {
    const res = await api.post('/admin/roles', data);
    return res?.data !== undefined ? res.data : res;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/roles/${id}`, data);
    return res?.data !== undefined ? res.data : res;
  },
  delete: async (id) => {
    const res = await api.delete(`/admin/roles/${id}`);
    return res?.data !== undefined ? res.data : res;
  }
};
