import { useState, useEffect, useCallback } from 'react';
import { auditLogService } from '../services/auditLogService';

export const useAuditLogs = (initialParams = {}) => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 20,
    module: '',
    action: '',
    ...initialParams
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams = {};
      Object.keys(params).forEach((key) => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          cleanParams[key] = params[key];
        }
      });

      const res = await auditLogService.getAll(cleanParams);
      setLogs(res.logs || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const updateFilters = (newFilters) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const changePage = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return {
    logs,
    pagination,
    params,
    loading,
    error,
    updateFilters,
    changePage,
    refetch: fetchLogs
  };
};
