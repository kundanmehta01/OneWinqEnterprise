import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = (initialRange = '7d') => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState(initialRange);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsService.getAggregatedMetrics({ range });
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load analytics metrics');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics: data,
    range,
    setRange,
    loading,
    error,
    refetch: fetchAnalytics
  };
};
