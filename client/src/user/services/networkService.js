import api from '../../services/api';

export const networkService = {
  getPeopleDirectory: async (params = {}) => {
    const res = await api.get('/network/people', { params });
    return res.data.data;
  },

  getMyConnections: async () => {
    const res = await api.get('/network/connections');
    return res.data.data;
  },

  removeConnection: async (id) => {
    const res = await api.delete(`/network/connections/${id}`);
    return res.data;
  },

  getIncomingRequests: async () => {
    const res = await api.get('/network/requests/incoming');
    return res.data.data;
  },

  getOutgoingRequests: async () => {
    const res = await api.get('/network/requests/outgoing');
    return res.data.data;
  },

  sendRequest: async (arg) => {
    const payload = typeof arg === 'object' ? arg : { recipientId: arg, note: '' };
    const res = await api.post('/network/requests', payload);
    return res.data.data;
  },

  acceptRequest: async (id) => {
    const res = await api.post(`/network/requests/${id}/accept`);
    return res.data.data;
  },

  declineRequest: async (id) => {
    const res = await api.post(`/network/requests/${id}/decline`);
    return res.data;
  },

  cancelRequest: async (id) => {
    const res = await api.post(`/network/requests/${id}/cancel`);
    return res.data;
  },

  // Aliases for compatibility with legacy component calls
  getPeople: async (params = {}) => {
    const res = await api.get('/network/people', { params });
    return res.data.data;
  },

  getConnections: async () => {
    const res = await api.get('/network/connections');
    return res.data.data;
  },

  getRequests: async () => {
    const [incoming, outgoing] = await Promise.all([
      api.get('/network/requests/incoming').then(r => r.data.data).catch(() => []),
      api.get('/network/requests/outgoing').then(r => r.data.data).catch(() => [])
    ]);
    return { requests: incoming, incoming, outgoing };
  },

  respondToRequest: async (id, action) => {
    if (action === 'accept') {
      const res = await api.post(`/network/requests/${id}/accept`);
      return res.data.data;
    } else {
      const res = await api.post(`/network/requests/${id}/decline`);
      return res.data;
    }
  }
};
