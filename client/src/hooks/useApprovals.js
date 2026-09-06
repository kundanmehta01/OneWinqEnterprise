import { useState, useEffect, useCallback } from 'react';
import { approvalService } from '../services/approvalService';

export const useApprovals = (initialParams = {}) => {
  const [approvals, setApprovals] = useState([]);
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
  const [statusTotals, setStatusTotals] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, changes_requested: 0 });

  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams = {};
      Object.keys(params).forEach((key) => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          cleanParams[key] = params[key];
        }
      });

      const [res, ...statusResults] = await Promise.all([
        approvalService.getApprovalRequests(cleanParams),
        ...['', 'pending', 'approved', 'rejected', 'changes_requested'].map((status) => approvalService.getApprovalRequests({ status, page: 1, limit: 1 }))
      ]);
      setApprovals(res.approvals || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
      setStatusTotals({
        total: statusResults[0]?.pagination?.totalItems || 0,
        pending: statusResults[1]?.pagination?.totalItems || 0,
        approved: statusResults[2]?.pagination?.totalItems || 0,
        rejected: statusResults[3]?.pagination?.totalItems || 0,
        changes_requested: statusResults[4]?.pagination?.totalItems || 0
      });
    } catch (err) {
      setError(err.message || 'Failed to load approvals');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const updateFilters = (newFilters) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const changePage = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return {
    approvals,
    pagination,
    params,
    loading,
    error,
    statusTotals,
    updateFilters,
    changePage,
    refetch: fetchApprovals
  };
};
