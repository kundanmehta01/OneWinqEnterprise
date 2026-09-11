import api from './axios';

export const templateApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/admin/templates', { params });
    return res?.data ?? res;
  },
  getById: async (id) => {
    const res = await api.get(`/admin/templates/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/admin/templates', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/templates/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/admin/templates/${id}`);
    return res.data;
  }
};

export const approvalApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/admin/approvals', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/admin/approvals/${id}`);
    return res.data;
  },
  review: async (id, data) => {
    const res = await api.post(`/admin/approvals/${id}/review`, data);
    return res.data;
  }
};

export const analyticsApi = {
  getMetrics: async (params = {}) => {
    const res = await api.get('/admin/analytics', { params });
    return res.data;
  }
};


export const invitationApi = {
  getAll: async (params = {}) => {
    const res = await api.get('/admin/invitations', { params });
    return res.data;
  },
  send: async (data) => {
    const res = await api.post('/admin/invitations', data);
    return res.data;
  },
  sendBulk: async (data) => {
    const res = await api.post('/admin/invitations/bulk', data);
    return res.data;
  },
  resend: async (id) => {
    const res = await api.post(`/admin/invitations/${id}/resend`);
    return res.data;
  },
  revoke: async (id) => {
    const res = await api.delete(`/admin/invitations/${id}`);
    return res.data;
  }
};

export const settingsApi = {
  getSettings: async () => {
    const res = await api.get('/admin/settings');
    return res.data;
  },
  updateSettings: async (data) => {
    const res = await api.put('/admin/settings', data);
    return res.data;
  }
};

export const dashboardApi = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  }
};
