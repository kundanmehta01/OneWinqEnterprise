import { notificationService } from './notification.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class NotificationController {
  async getMyNotifications(req, res, next) {
    try {
      const result = await notificationService.getUserNotifications(req.user._id, req.query);
      return ApiResponse.paginated(res, {
        data: result.notifications,
        pagination: result.pagination,
        meta: { unreadCount: result.unreadCount }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const count = await notificationService.getUnreadCount(req.user._id);
      return ApiResponse.success(res, { data: { unreadCount: count } });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const notification = await notificationService.markAsRead(req.params.id, req.user._id);
      if (!notification) {
        return ApiResponse.error(res, { statusCode: 404, message: 'Notification not found' });
      }
      return ApiResponse.success(res, {
        message: 'Notification marked as read',
        data: notification
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const result = await notificationService.markAllAsRead(req.user._id);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
