import api from './axios';

export const approvalApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/admin/approvals', { params });
    return res;
  },
  getStats: async () => {
    const res = await api.get('/admin/approvals/stats');
    return res?.data || res;
  },
  getById: async (id) => {
    const res = await api.get(`/admin/approvals/${id}`);
    return res?.data || res;
  },
  review: async (id, data) => {
    const res = await api.post(`/admin/approvals/${id}/review`, data);
    return res?.data || res;
  }
};
