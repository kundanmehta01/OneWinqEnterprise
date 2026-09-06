import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const publicProfileService = {
  getProfileBySlug: async (slug) => {
    const res = await api.get(`${ENDPOINTS.PUBLIC.PROFILES}/${slug}`);
    return res.data.data;
  },

  getQrCodeUrl: (slug) => {
    return `${api.defaults.baseURL}${ENDPOINTS.PUBLIC.PROFILES}/${slug}/qr`;
  },

  recordEvent: async ({ eventType, targetType = 'EMPLOYEE', targetId, slug, templateId, metadata = {} }) => {
    try {
      const res = await api.post(ENDPOINTS.PUBLIC.EVENTS, {
        eventType,
        targetType,
        targetId,
        slug,
        templateId,
        metadata
      });
      return res.data;
    } catch {
      // Telemetry errors should fail silently in the background
      return null;
    }
  }
};
