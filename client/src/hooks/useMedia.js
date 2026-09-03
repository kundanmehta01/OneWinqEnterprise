import { useState, useEffect, useCallback } from 'react';
import { mediaService } from '../services/mediaService';

export const useMedia = (initialParams = {}) => {
  const [assets, setAssets] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 12,
    search: '',
    type: '',
    ...initialParams
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams = {};
      Object.keys(params).forEach((k) => {
        if (params[k] !== '' && params[k] !== null && params[k] !== undefined) {
          cleanParams[k] = params[k];
        }
      });
      const res = await mediaService.getAll(cleanParams);
      setAssets(res.assets || []);
      if (res.pagination) setPagination(res.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load media assets');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      const uploaded = await mediaService.upload(file);
      setAssets((prev) => [uploaded, ...prev]);
      return uploaded;
    } finally {
      setUploading(false);
    }
  };

  const deleteAsset = async (id) => {
    await mediaService.delete(id);
    setAssets((prev) => prev.filter((a) => a._id !== id));
  };

  const updateFilters = (newFilters) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const changePage = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return {
    assets,
    pagination,
    loading,
    uploading,
    error,
    params,
    uploadFile,
    deleteAsset,
    updateFilters,
    changePage,
    refetch: fetchAssets
  };
};
