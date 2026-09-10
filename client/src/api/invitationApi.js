import api from './axios';

export const invitationApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/admin/invitations', { params });
    return res.data;
  },
  send: async (data) => {
    const res = await api.post('/admin/invitations', data);
    return res.data;
  },
  sendBulk: async (data) => {
    const res = await api.post('/admin/invitations/bulk', data);
    return res.data;
  },
  resend: async (id) => {
    const res = await api.post(`/admin/invitations/${id}/resend`);
    return res.data;
  },
  revoke: async (id) => {
    const res = await api.delete(`/admin/invitations/${id}`);
    return res.data;
  }
};
