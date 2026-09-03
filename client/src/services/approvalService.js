import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const approvalService = {
  getAll: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.APPROVALS, { params });
    return {
      approvals: res.data.data,
      pagination: res.data.pagination
    };
  },

  getById: async (id) => {
    const res = await api.get(`${ENDPOINTS.ADMIN.APPROVALS}/${id}`);
    return res.data.data;
  },

  review: async (id, { action, reviewNote = '', requestedChanges = [] }) => {
    const res = await api.post(`${ENDPOINTS.ADMIN.APPROVALS}/${id}/review`, {
      action,
      reviewNote,
      requestedChanges
    });
    return res.data.data;
  }
};
