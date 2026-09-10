import api from './axios';

export const companyApi = {
  // Public company profile for 8-screen identity flow
  getPublicCompanyProfile: async () => {
    const res = await api.get('/public/company');
    return res.data;
  },

  // Public enterprise team directory
  getPublicTeam: async () => {
    const res = await api.get('/public/team');
    return res.data;
  },

  // Enterprise Admin company profile
  getAdminCompanyProfile: async () => {
    const res = await api.get('/admin/company-profile');
    return res.data;
  },

  // Update Enterprise Admin company profile
  updateAdminCompanyProfile: async (updateData) => {
    const res = await api.patch('/admin/company-profile', updateData);
    return res.data;
  },
};
