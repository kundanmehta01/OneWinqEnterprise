import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const approvalService = {
  // Backend contract: GET /admin/approvals and GET /admin/approvals/:id
  getApprovalRequests: async (params = {}) => approvalService.getAll(params),
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
  },

  getProfileDetails: async (id) => approvalService.getById(id),
  approveProfile: async (id, reviewNote = '') => approvalService.review(id, { action: 'approve', reviewNote }),
  rejectProfile: async (id, reviewNote = '') => approvalService.review(id, { action: 'reject', reviewNote }),
  requestChanges: async (id, reviewNote, requestedChanges = []) => approvalService.review(id, { action: 'request_changes', reviewNote, requestedChanges })
};
