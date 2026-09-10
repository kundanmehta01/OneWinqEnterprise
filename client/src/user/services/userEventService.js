import api from '../../services/api';

export const userEventService = {
  getEvents: async (params = {}) => {
    const res = await api.get('/events', { params });
    return res.data.data;
  },

  getMyEvents: async (params = {}) => {
    const res = await api.get('/events/my-events', { params });
    return res.data.data;
  },

  getEventById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data.data;
  },

  registerForEvent: async (id) => {
    const res = await api.post(`/events/${id}/register`);
    return res.data.data;
  },

  cancelRegistration: async (id) => {
    const res = await api.post(`/events/${id}/cancel`);
    return res.data.data;
  }
};
