import api from './axios';

export const connectionApi = {
  getPeople: async (params = {}) => {
    const res = await api.get('/network/people', { params });
    return res.data || res;
  },

  getMyConnections: async (params = {}) => {
    const res = await api.get('/network/connections', { params });
    return res.data || res;
  },

  getIncomingRequests: async (params = {}) => {
    const res = await api.get('/network/requests/incoming', { params });
    return res.data || res;
  },

  getOutgoingRequests: async (params = {}) => {
    const res = await api.get('/network/requests/outgoing', { params });
    return res.data || res;
  },

  sendRequest: async (recipientId, note = '') => {
    const res = await api.post('/network/requests', { recipientId, note });
    return res.data || res;
  },

  acceptRequest: async (connectionId) => {
    const res = await api.post(`/network/requests/${connectionId}/accept`);
    return res.data || res;
  },

  declineRequest: async (connectionId) => {
    const res = await api.post(`/network/requests/${connectionId}/decline`);
    return res.data || res;
  },

  cancelRequest: async (connectionId) => {
    const res = await api.post(`/network/requests/${connectionId}/cancel`);
    return res.data || res;
  },

  removeConnection: async (connectionId) => {
    const res = await api.delete(`/network/connections/${connectionId}`);
    return res.data || res;
  }
};
