import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const authService = {
  login: async ({ email, password }) => {
    const res = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    return res.data.data;
  },

  getMe: async () => {
    const res = await api.get(ENDPOINTS.AUTH.ME);
    return res.data.data;
  },

  logout: async (refreshToken) => {
    const res = await api.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken });
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return res.data;
  },

  resetPassword: async ({ token, newPassword }) => {
    const res = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
    return res.data;
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    const res = await api.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword });
    return res.data;
  },

  /**
   * NOTE: There is NO /auth/register endpoint on this backend.
   * OneWinq uses an invite-only onboarding model:
   *   1. Admin sends invitation  → POST /api/v1/admin/invitations
   *   2. Invitee verifies token  → GET  /api/v1/invitations/verify?token=...
   *   3. Invitee sets password   → POST /api/v1/invitations/accept  { token, password, name? }
   *
   * Use invitationService.acceptInvitation() for step 3.
   */
};
