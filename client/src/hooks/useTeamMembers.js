import { useState, useEffect, useCallback } from 'react';
import { teamMemberService } from '../services/teamMemberService';

export const useTeamMembers = (initialParams = {}) => {
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
    departmentId: '',
    roleId: '',
    status: '',
    ...initialParams
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams = {};
      Object.keys(params).forEach((key) => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          cleanParams[key] = params[key];
        }
      });

      const res = await teamMemberService.getAll(cleanParams);
      setMembers(res.members || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const updateFilters = (newFilters) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const changePage = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const changeLimit = (limit) => {
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  return {
    members,
    pagination,
    params,
    loading,
    error,
    updateFilters,
    changePage,
    changeLimit,
    refetch: fetchMembers
  };
};
