import api from './axios';

export const notificationApi = {
  getMyNotifications: async (params = {}) => {
    const res = await api.get('/me/notifications', { params });
    return res.data || res;
  },

  getUnreadCount: async () => {
    const res = await api.get('/me/notifications/unread-count');
    return res.data || res;
  },

  markAsRead: async (id) => {
    const res = await api.patch(`/me/notifications/${id}/read`);
    return res.data || res;
  },

  markAllAsRead: async () => {
    const res = await api.post('/me/notifications/mark-all-read');
    return res.data || res;
  }
};
