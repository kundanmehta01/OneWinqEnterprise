import api from './axios';

export const userProfileApi = {
  // Employee Self-Service Profile
  getMyProfile: async () => {
    const res = await api.get('/me/profile');
    return res.data || res;
  },

  updateMyDraft: async (data) => {
    const res = await api.patch('/me/profile', data);
    return res.data || res;
  },

  submitForApproval: async (reviewNotes = '') => {
    const res = await api.post('/me/profile/submit', { reviewNotes });
    return res.data || res;
  },

  getMyApprovalStatus: async () => {
    const res = await api.get('/me/profile/status');
    return res.data || res;
  },

  getMyDashboard: async () => {
    const res = await api.get('/me/dashboard');
    return res.data || res;
  },

  getMySettings: async () => {
    const res = await api.get('/me/settings');
    return res.data || res;
  },

  updateMySettings: async (data) => {
    const res = await api.patch('/me/settings', data);
    return res.data || res;
  },

  // Public Employee Digital Profile by Slug
  getPublicProfile: async (slug) => {
    const res = await api.get(`/public/profile/${slug}`);
    return res.data || res;
  },

  getProfileQrCode: async (slug) => {
    const res = await api.get(`/public/profile/${slug}/qr`);
    return res.data || res;
  },

  recordTelemetryEvent: async (eventData) => {
    const res = await api.post('/public/events', eventData);
    return res.data || res;
  },

  resolveCardTap: async (cardUid) => {
    const res = await api.get(`/public/card/${cardUid}`);
    return res.data || res;
  }
};
