import api from './axios';

export const eventApi = {
  // User/Employee Event Endpoints
  getEvents: async (params = {}) => {
    const res = await api.get('/events', { params });
    return res.data || res;
  },

  getEventById: async (id) => {
    const res = await api.get(`/events/${id}`);
    return res.data || res;
  },

  register: async (id) => {
    const res = await api.post(`/events/${id}/register`);
    return res.data || res;
  },

  cancelRegistration: async (id) => {
    const res = await api.delete(`/events/${id}/register`);
    return res.data || res;
  },

  getMyEvents: async (params = {}) => {
    const res = await api.get('/events/my-events', { params });
    return res.data || res;
  },

  // Admin Event Management Endpoints
  create: async (data) => {
    const res = await api.post('/admin/events', data);
    return res.data || res;
  },

  update: async (id, data) => {
    const res = await api.patch(`/admin/events/${id}`, data);
    return res.data || res;
  },

  cancel: async (id) => {
    const res = await api.post(`/admin/events/${id}/cancel`);
    return res.data || res;
  },

  getAttendees: async (id, params = {}) => {
    const res = await api.get(`/events/${id}/attendees`, { params });
    return res?.data !== undefined ? res.data : res;
  }
};
