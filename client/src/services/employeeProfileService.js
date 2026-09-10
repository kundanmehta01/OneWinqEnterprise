import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const employeeProfileService = {
  getMyProfile: async () => {
    const res = await api.get(ENDPOINTS.ME.PROFILE);
    return res.data.data;
  },

  updateDraftProfile: async (data) => {
    const res = await api.patch(ENDPOINTS.ME.PROFILE, data);
    return res.data.data;
  },

  submitForApproval: async (data = {}) => {
    const res = await api.post(ENDPOINTS.ME.SUBMIT_PROFILE, data);
    return res.data.data;
  },

  getMyApprovalStatus: async () => {
    const res = await api.get(ENDPOINTS.ME.PROFILE_STATUS);
    return res.data.data;
  }
};
