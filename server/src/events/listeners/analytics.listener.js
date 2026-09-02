import { eventBus } from '../appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { analyticsService } from '../../modules/analytics/analytics.service.js';

export const registerAnalyticsListeners = () => {
  eventBus.subscribeEvent(APP_EVENTS.ANALYTICS_EVENT_RECORDED, async (payload) => {
    await analyticsService.recordEvent({
      eventType: payload.eventType,
      targetType: payload.targetType || 'EMPLOYEE',
      targetId: payload.targetId,
      slug: payload.slug,
      templateId: payload.templateId,
      metadata: payload.metadata || {},
      ipAddress: payload.ipAddress || '',
      userAgent: payload.userAgent || '',
      referer: payload.referer || ''
    });
  });
};
