import axios from 'axios'

const API = '/api/v1/admin'

export const teamMemberService = {
  getAll: (params) => axios.get(`${API}/team`, { params }).then(r => r.data.data),
  getById: (id) => axios.get(`${API}/team/${id}`).then(r => r.data.data),
  create: (data) => axios.post(`${API}/team`, data).then(r => r.data.data),
  update: (id, data) => axios.patch(`${API}/team/${id}`, data).then(r => r.data.data),
  delete: (id) => axios.delete(`${API}/team/${id}`).then(r => r.data.data),
}

export const templateService = {
  getAll: (params) => axios.get(`${API}/templates`, { params }).then(r => r.data.data),
  getById: (id) => axios.get(`${API}/templates/${id}`).then(r => r.data.data),
  create: (data) => axios.post(`${API}/templates`, data).then(r => r.data.data),
  update: (id, data) => axios.patch(`${API}/templates/${id}`, data).then(r => r.data.data),
  delete: (id) => axios.delete(`${API}/templates/${id}`).then(r => r.data.data),
}

export const roleService = {
  getAll: (params) => axios.get(`${API}/roles`, { params }).then(r => r.data.data),
  getById: (id) => axios.get(`${API}/roles/${id}`).then(r => r.data.data),
  create: (data) => axios.post(`${API}/roles`, data).then(r => r.data.data),
  update: (id, data) => axios.patch(`${API}/roles/${id}`, data).then(r => r.data.data),
  delete: (id) => axios.delete(`${API}/roles/${id}`).then(r => r.data.data),
}

export const profileApprovalService = {
  getAll: (params) => axios.get(`${API}/approvals`, { params }).then(r => r.data.data),
  getById: (id) => axios.get(`${API}/approvals/${id}`).then(r => r.data.data),
  approve: (id, data) => axios.post(`${API}/approvals/${id}/approve`, data).then(r => r.data.data),
  reject: (id, data) => axios.post(`${API}/approvals/${id}/reject`, data).then(r => r.data.data),
}

export const analyticsService = {
  getOverview: (params) => axios.get(`${API}/analytics`, { params }).then(r => r.data.data),
  getProfileViews: (params) => axios.get(`${API}/analytics/profile-views`, { params }).then(r => r.data.data),
  getProfileShares: (params) => axios.get(`${API}/analytics/profile-shares`, { params }).then(r => r.data.data),
  getQRScans: (params) => axios.get(`${API}/analytics/qr-scans`, { params }).then(r => r.data.data),
  getLinkClicks: (params) => axios.get(`${API}/analytics/link-clicks`, { params }).then(r => r.data.data),
}

export const departmentService = {
  getAll: (params) => axios.get(`${API}/departments`, { params }).then(r => r.data.data),
  getById: (id) => axios.get(`${API}/departments/${id}`).then(r => r.data.data),
  create: (data) => axios.post(`${API}/departments`, data).then(r => r.data.data),
  update: (id, data) => axios.patch(`${API}/departments/${id}`, data).then(r => r.data.data),
  delete: (id) => axios.delete(`${API}/departments/${id}`).then(r => r.data.data),
}

export const invitationService = {
  getAll: (params) => axios.get(`${API}/invitations`, { params }).then(r => r.data.data),
  getById: (id) => axios.get(`${API}/invitations/${id}`).then(r => r.data.data),
  send: (data) => axios.post(`${API}/invitations`, data).then(r => r.data.data),
  resend: (id) => axios.post(`${API}/invitations/${id}/resend`).then(r => r.data.data),
  revoke: (id) => axios.delete(`${API}/invitations/${id}`).then(r => r.data.data),
}

export const companyProfileService = {
  get: () => axios.get(`${API}/company-profile`).then(r => r.data.data),
  update: (data) => axios.patch(`${API}/company-profile`, data).then(r => r.data.data),
}

export const auditLogService = {
  getAll: (params) => axios.get(`${API}/audit-logs`, { params }).then(r => r.data.data),
}
