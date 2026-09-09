import api from '../../services/api';

export const userDirectoryService = {
  getDepartments: async () => {
    const res = await api.get('/user/departments');
    return res.data.data;
  },

  getDepartmentById: async (id) => {
    const res = await api.get(`/user/departments/${id}`);
    return res.data.data;
  },

  getTeamDirectory: async (params = {}) => {
    const res = await api.get('/user/team', { params });
    return res.data.data;
  },

  getCompanyOverview: async () => {
    try {
      const res = await api.get('/user/company');
      return res.data.data;
    } catch {
      const res = await api.get('/public/company');
      return res.data.data;
    }
  }
};
