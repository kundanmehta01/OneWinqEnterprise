import api from './api'

const API = '/admin'
const PUBLIC_API = '/public'

export const teamMemberService = {
  getAll: (params) => api.get(`${API}/team`, { params }).then((r) => r.data.data),
  getById: (id) => api.get(`${API}/team/${id}`).then((r) => r.data.data),
  create: (data) => api.post(`${API}/team`, data).then((r) => r.data.data),
  update: (id, data) => api.patch(`${API}/team/${id}`, data).then((r) => r.data.data),
  delete: (id) => api.delete(`${API}/team/${id}`).then((r) => r.data.data),
}

export const templateService = {
  getAll: (params) => api.get(`${API}/templates`, { params }).then((r) => r.data.data),
  getById: (id) => api.get(`${API}/templates/${id}`).then((r) => r.data.data),
  create: (data) => api.post(`${API}/templates`, data).then((r) => r.data.data),
  update: (id, data) => api.patch(`${API}/templates/${id}`, data).then((r) => r.data.data),
  delete: (id) => api.delete(`${API}/templates/${id}`).then((r) => r.data.data),
}

export const roleService = {
  getAll: (params) => api.get(`${API}/roles`, { params }).then((r) => r.data.data),
  getById: (id) => api.get(`${API}/roles/${id}`).then((r) => r.data.data),
  create: (data) => api.post(`${API}/roles`, data).then((r) => r.data.data),
  update: (id, data) => api.patch(`${API}/roles/${id}`, data).then((r) => r.data.data),
  delete: (id) => api.delete(`${API}/roles/${id}`).then((r) => r.data.data),
}

export const permissionService = {
  getAll: (params) => api.get(`${API}/permissions`, { params }).then((r) => r.data.data),
  getByModule: (params) => api.get(`${API}/permissions/by-module`, { params }).then((r) => r.data.data),
}

export const profileApprovalService = {
  getAll: (params) => api.get(`${API}/approvals`, { params }).then((r) => r.data.data),
  getById: (id) => api.get(`${API}/approvals/${id}`).then((r) => r.data.data),
  review: (id, data) => api.post(`${API}/approvals/${id}/review`, data).then((r) => r.data.data),
  approve: (id, data = {}) => api.post(`${API}/approvals/${id}/review`, { ...data, action: 'approve' }).then((r) => r.data.data),
  reject: (id, data = {}) => api.post(`${API}/approvals/${id}/review`, { ...data, action: 'reject' }).then((r) => r.data.data),
  requestChanges: (id, data = {}) => api.post(`${API}/approvals/${id}/review`, { ...data, action: 'request_changes' }).then((r) => r.data.data),
}

export const analyticsService = {
  getOverview: (params) => api.get(`${API}/analytics`, { params }).then((r) => r.data.data),
  getProfileViews: (params) => api.get(`${API}/analytics/profile-views`, { params }).then((r) => r.data.data),
  getProfileShares: (params) => api.get(`${API}/analytics/profile-shares`, { params }).then((r) => r.data.data),
  getQRScans: (params) => api.get(`${API}/analytics/qr-scans`, { params }).then((r) => r.data.data),
  getLinkClicks: (params) => api.get(`${API}/analytics/link-clicks`, { params }).then((r) => r.data.data),
}

export const departmentService = {
  getAll: (params) => api.get(`${API}/departments`, { params }).then((r) => r.data.data),
  getById: (id) => api.get(`${API}/departments/${id}`).then((r) => r.data.data),
  create: (data) => api.post(`${API}/departments`, data).then((r) => r.data.data),
  update: (id, data) => api.patch(`${API}/departments/${id}`, data).then((r) => r.data.data),
  delete: (id) => api.delete(`${API}/departments/${id}`).then((r) => r.data.data),
}

export const invitationService = {
  getAll: (params) => api.get(`${API}/invitations`, { params }).then((r) => r.data.data),
  getById: (id) => api.get(`${API}/invitations/${id}`).then((r) => r.data.data),
  send: (data) => api.post(`${API}/invitations`, data).then((r) => r.data.data),
  resend: (id) => api.post(`${API}/invitations/${id}/resend`).then((r) => r.data.data),
  revoke: (id) => api.delete(`${API}/invitations/${id}`).then((r) => r.data.data),
}

export const companyProfileService = {
  get: () => api.get(`${API}/company-profile`).then((r) => r.data.data),
  update: (data) => api.patch(`${API}/company-profile`, data).then((r) => r.data.data),
}

export const mediaService = {
  getAll: (params) => api.get(`${API}/media`, { params }).then((r) => r.data.data),
  upload: (file, metadata = {}) => {
    const formData = new FormData()
    formData.append('file', file)
    if (metadata.entityType) formData.append('entityType', metadata.entityType)
    if (metadata.entityId) formData.append('entityId', metadata.entityId)
    return api.post(`${API}/media/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data)
  },
  delete: (id) => api.delete(`${API}/media/${id}`).then((r) => r.data.data),
}

export const publicProfileService = {
  getQrCode: (slug) => api.get(`${PUBLIC_API}/profiles/${slug}/qr?format=svg`).then((r) => r.data.data || r.data),
}

export const auditLogService = {
  getAll: (params) => api.get(`${API}/audit-logs`, { params }).then((r) => r.data.data),
}
