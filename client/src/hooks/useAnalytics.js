import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

export const useAnalytics = (initialRange = '7d', initialDates = {}) => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState(initialRange);
  const [dates, setDates] = useState(initialDates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { range };
      if (range === 'custom') {
        if (dates.startDate) params.startDate = dates.startDate;
        if (dates.endDate) params.endDate = dates.endDate;
      }
      const res = await analyticsService.getAggregatedMetrics(params);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load analytics metrics');
    } finally {
      setLoading(false);
    }
  }, [range, dates]);

  useEffect(() => {
    fetchAnalytics();
    const interval = window.setInterval(fetchAnalytics, 30000);
    return () => window.clearInterval(interval);
  }, [fetchAnalytics]);

  return {
    analytics: data,
    range,
    setRange,
    dates,
    setDates,
    loading,
    error,
    refetch: fetchAnalytics
  };
};
