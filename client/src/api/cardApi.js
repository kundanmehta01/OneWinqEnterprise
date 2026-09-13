import api from './axios';

export const cardApi = {
  // Admin Card Management
  getAll: async (params = {}) => {
    const res = await api.get('/admin/cards', { params });
    return res.data || res;
  },

  getStats: async () => {
    const res = await api.get('/admin/cards/stats');
    return res.data || res;
  },

  getById: async (id) => {
    const res = await api.get(`/admin/cards/${id}`);
    return res.data || res;
  },

  create: async (data) => {
    const res = await api.post('/admin/cards', data);
    return res.data || res;
  },

  createBulk: async (cards) => {
    const res = await api.post('/admin/cards/bulk', { cards });
    return res.data || res;
  },

  assign: async (data) => {
    const res = await api.post('/admin/cards/assign', data);
    return res.data || res;
  },

  unassign: async (data) => {
    const res = await api.post('/admin/cards/unassign', data);
    return res.data || res;
  },

  generateActivationLink: async (id) => {
    const res = await api.post(`/admin/cards/${id}/activation-link`);
    return res.data || res;
  },

  updateStatus: async (id, data) => {
    const res = await api.patch(`/admin/cards/${id}/status`, data);
    return res.data || res;
  },

  delete: async (id) => {
    const res = await api.delete(`/admin/cards/${id}`);
    return res.data || res;
  },

  // User Activation Flow
  getActivationDetails: async (token) => {
    const res = await api.get(`/cards/activate/${token}`);
    return res.data || res;
  },

  activate: async (token) => {
    const res = await api.post(`/cards/activate/${token}`);
    return res.data || res;
  },

  // User claim unlinked card to profile
  claimCard: async (cardUid) => {
    const res = await api.post('/cards/claim', { cardUid });
    return res.data || res;
  },

  // Public Smart Card Tap Resolver

  resolvePublicTap: async (cardUid) => {
    const res = await api.get(`/public/cards/${cardUid}`);
    return res.data || res;
  },

  // Legacy aliases
  link: async (data) => {
    const res = await api.post('/admin/cards/assign', data);
    return res.data || res;
  },

  unlink: async (data) => {
    const res = await api.post('/admin/cards/unassign', data);
    return res.data || res;
  }
};
