import { useState, useEffect, useCallback } from 'react';
import { invitationService } from '../services/invitationService';

export const useInvitations = (initialParams = {}) => {
  const [invitations, setInvitations] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    status: '',
    ...initialParams
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvitations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams = {};
      Object.keys(params).forEach((key) => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          cleanParams[key] = params[key];
        }
      });

      const res = await invitationService.getAll(cleanParams);
      setInvitations(res.invitations || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load invitations');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const updateFilters = (newFilters) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const changePage = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return {
    invitations,
    pagination,
    params,
    loading,
    error,
    updateFilters,
    changePage,
    refetch: fetchInvitations
  };
};
