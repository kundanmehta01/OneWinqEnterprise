import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const notificationService = {
  getMyNotifications: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ME.NOTIFICATIONS, { params });
    return {
      notifications: res.data.data,
      pagination: res.data.pagination
    };
  },

  getUnreadCount: async () => {
    const res = await api.get(ENDPOINTS.ME.NOTIFICATIONS_UNREAD);
    return res.data.data.unreadCount;
  },

  markAsRead: async (id) => {
    const res = await api.patch(`${ENDPOINTS.ME.NOTIFICATIONS}/${id}/read`);
    return res.data.data;
  },

  markAllAsRead: async () => {
    const res = await api.post(ENDPOINTS.ME.NOTIFICATIONS_MARK_ALL);
    return res.data;
  }
};
