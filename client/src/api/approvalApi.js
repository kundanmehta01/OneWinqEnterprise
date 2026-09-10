import api from './axios';

export const approvalApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/admin/approvals', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/admin/approvals/${id}`);
    return res.data;
  },
  review: async (id, data) => {
    const res = await api.post(`/admin/approvals/${id}/review`, data);
    return res.data;
  }
};
