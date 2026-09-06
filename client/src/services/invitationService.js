import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const invitationService = {
  getAll: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.INVITATIONS, { params });
    return {
      invitations: res.data.data,
      pagination: res.data.pagination
    };
  },

  getById: async (id) => {
    const res = await api.get(`${ENDPOINTS.ADMIN.INVITATIONS}/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await api.post(ENDPOINTS.ADMIN.INVITATIONS, data);
    return res.data.data;
  },

  resend: async (id) => {
    const res = await api.post(`${ENDPOINTS.ADMIN.INVITATIONS}/${id}/resend`);
    return res.data.data;
  },

  cancel: async (id) => {
    const res = await api.post(`${ENDPOINTS.ADMIN.INVITATIONS}/${id}/cancel`);
    return res.data;
  },

  verifyToken: async (token) => {
    const res = await api.get(ENDPOINTS.PUBLIC.INVITATIONS_VERIFY, { params: { token } });
    return res.data.data;
  },

  /**
   * Accept an invitation and set account password.
   * Backend schema (acceptInvitationSchema): { token, password, name? }
   * NOTE: confirmPassword is NOT sent to the backend — validation is client-side only.
   */
  acceptInvitation: async ({ token, password, name }) => {
    const res = await api.post(ENDPOINTS.PUBLIC.INVITATIONS_ACCEPT, {
      token,
      password,
      ...(name && { name })
    });
    return res.data.data;
  }
};
