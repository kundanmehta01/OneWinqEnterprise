// import { registerAuditListeners } from './audit.listener.js'; // Audit logs removed
import { registerNotificationListeners } from './notification.listener.js';
import { registerAnalyticsListeners } from './analytics.listener.js';
import { logger } from '../../config/logger.config.js';

export const initializeEventListeners = () => {
  // registerAuditListeners(); // Audit logs removed
  registerNotificationListeners();
  registerAnalyticsListeners();
  logger.info('Application event listeners initialized.');
};
