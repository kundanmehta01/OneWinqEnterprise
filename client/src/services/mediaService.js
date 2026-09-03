import api from './api';
import { ENDPOINTS } from '../constants/apiRoutes';

export const mediaService = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post(ENDPOINTS.ADMIN.MEDIA + '/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.data;
  },

  getAll: async (params = {}) => {
    const res = await api.get(ENDPOINTS.ADMIN.MEDIA, { params });
    return {
      assets: res.data.data,
      pagination: res.data.pagination
    };
  },

  delete: async (id) => {
    const res = await api.delete(`${ENDPOINTS.ADMIN.MEDIA}/${id}`);
    return res.data;
  }
};
