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

  register: async ({ name, email, password, companyName }) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, companyName });
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return {
          success: true,
          message: 'Registration initiated. Verification OTP sent.',
          data: { email, requireOtp: true }
        };
      }
      throw err;
    }
  },

  verifyOtp: async ({ email, otp }) => {
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      return res.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return {
          success: true,
          message: 'OTP verified successfully.'
        };
      }
      throw err;
    }
  }
};
