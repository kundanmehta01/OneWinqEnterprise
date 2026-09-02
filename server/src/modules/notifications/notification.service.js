import { Notification } from './notification.model.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { logger } from '../../config/logger.config.js';

class NotificationService {
  async createNotification({ recipientId, type, title, message, data = {}, channel = 'in_app' }) {
    try {
      const notification = await Notification.create({
        recipientId,
        type,
        title,
        message,
        data,
        channel
      });
      return notification;
    } catch (error) {
      logger.error(`[NotificationService] Failed to create notification: ${error.message}`, { error });
      return null;
    }
  }

  async getUserNotifications(userId, query = {}) {
    const { page, limit, skip } = parsePagination(query, 20);
    const filter = { recipientId: userId };

    if (query.unreadOnly === 'true') {
      filter.isRead = false;
    }

    const [notifications, totalItems, unreadCount] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipientId: userId, isRead: false })
    ]);

    return {
      notifications,
      unreadCount,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async getUnreadCount(userId) {
    return await Notification.countDocuments({ recipientId: userId, isRead: false });
  }

  async markAsRead(id, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipientId: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    return notification;
  }

  async markAllAsRead(userId) {
    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    return { message: 'All notifications marked as read' };
  }
}

export const notificationService = new NotificationService();
