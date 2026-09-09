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

  sendRequest: async ({ recipientId, note = '' }) => {
    const res = await api.post('/network/requests', { recipientId, note });
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
  }
};
