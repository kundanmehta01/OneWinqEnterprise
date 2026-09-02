import { Router } from 'express';
import { notificationController } from './notification.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getMyNotifications.bind(notificationController));
router.get('/unread-count', notificationController.getUnreadCount.bind(notificationController));
router.patch('/:id/read', notificationController.markAsRead.bind(notificationController));
router.post('/mark-all-read', notificationController.markAllAsRead.bind(notificationController));

export const notificationRoutes = router;
