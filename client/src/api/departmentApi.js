import api from './axios';

export const departmentApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/admin/departments', { params });
    return res?.data !== undefined ? res.data : res;
  },
  getById: async (id) => {
    const res = await api.get(`/admin/departments/${id}`);
    return res?.data !== undefined ? res.data : res;
  },
  create: async (data) => {
    const res = await api.post('/admin/departments', data);
    return res?.data !== undefined ? res.data : res;
  },
  update: async (id, data) => {
    const res = await api.patch(`/admin/departments/${id}`, data);
    return res?.data !== undefined ? res.data : res;
  },
  delete: async (id) => {
    const res = await api.delete(`/admin/departments/${id}`);
    return res?.data !== undefined ? res.data : res;
  }
};
