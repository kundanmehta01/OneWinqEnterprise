import { useState, useEffect, useCallback } from 'react';
import { permissionService } from '../services/permissionService';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allList, byModule] = await Promise.all([
        permissionService.getAll(),
        permissionService.getByModule()
      ]);
      setPermissions(allList || []);
      setGroupedPermissions(byModule || {});
    } catch (err) {
      setError(err.message || 'Failed to load permissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return {
    permissions,
    groupedPermissions,
    loading,
    error,
    refetch: fetchPermissions
  };
};
