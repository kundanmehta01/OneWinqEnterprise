import api from './axios';

export const userDirectoryApi = {
  getDepartments: async () => {
    const res = await api.get('/user/departments');
    return res.data?.departments || res.departments || res.data || [];
  },

  getDepartmentById: async (id) => {
    const res = await api.get(`/user/departments/${id}`);
    return res.data || res;
  },

  getTeam: async (params = {}) => {
    const res = await api.get('/user/team', { params });
    return res.data || res;
  },

  getCompany: async () => {
    const res = await api.get('/user/company');
    return res.data || res;
  }
};

