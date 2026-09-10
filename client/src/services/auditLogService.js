import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const auditLogService = {
  getAll: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.AUDIT_LOGS, { params });
    return {
      logs: res.data.data,
      pagination: res.data.pagination
    };
  },

  getById: async (id) => {
    const res = await api.get(`${ENDPOINTS.ADMIN.AUDIT_LOGS}/${id}`);
    return res.data.data;
  }
};
