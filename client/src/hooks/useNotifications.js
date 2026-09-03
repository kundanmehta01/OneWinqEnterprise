import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = (initialParams = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 15
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 15,
    ...initialParams
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, count] = await Promise.all([
        notificationService.getMyNotifications(params),
        notificationService.getUnreadCount()
      ]);
      setNotifications(listRes.notifications || []);
      if (listRes.pagination) setPagination(listRes.pagination);
      setUnreadCount(count);
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    notifications,
    unreadCount,
    pagination,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    setPage: (page) => setParams((prev) => ({ ...prev, page })),
    refetch: fetchNotifications
  };
};
