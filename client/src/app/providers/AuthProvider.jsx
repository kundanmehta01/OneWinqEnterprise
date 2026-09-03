import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { storage } from '../../utils/storage';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());
  const [member, setMember] = useState(null);
  const [role, setRole] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = storage.getAccessToken();
    if (!token) {
      setUser(null);
      setMember(null);
      setRole(null);
      setIsSuperAdmin(false);
      setPermissions([]);
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();
      setUser(data.user);
      setMember(data.member);
      setRole(data.role);
      setIsSuperAdmin(Boolean(data.isSuperAdmin));
      setPermissions(data.permissions || []);
      storage.setUser(data.user);
    } catch (err) {
      console.error('Failed to load user info:', err);
      storage.clearAuth();
      setUser(null);
      setMember(null);
      setRole(null);
      setIsSuperAdmin(false);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    const handleAuthExpired = () => {
      setUser(null);
      setMember(null);
      setRole(null);
      setIsSuperAdmin(false);
      setPermissions([]);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [fetchCurrentUser]);

  const login = async ({ email, password }) => {
    const result = await authService.login({ email, password });
    storage.setAccessToken(result.accessToken);
    if (result.refreshToken) {
      storage.setRefreshToken(result.refreshToken);
    }
    storage.setUser(result.user);

    setUser(result.user);
    setMember(result.member);
    setRole(result.member?.roleId?.name || (result.user.email === 'superadmin@onewinq.com' ? 'Super Admin' : 'Employee'));
    setIsSuperAdmin(result.user.email === 'superadmin@onewinq.com');

    // Fetch full permissions & state
    await fetchCurrentUser();
    return result;
  };

  const logout = async () => {
    try {
      const refreshToken = storage.getRefreshToken();
      await authService.logout(refreshToken);
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      storage.clearAuth();
      setUser(null);
      setMember(null);
      setRole(null);
      setIsSuperAdmin(false);
      setPermissions([]);
    }
  };

  const hasPermission = useCallback(
    (perm) => {
      if (isSuperAdmin || permissions.includes('*')) return true;
      return permissions.includes(perm);
    },
    [isSuperAdmin, permissions]
  );

  const hasAnyPermission = useCallback(
    (perms = []) => {
      if (isSuperAdmin || permissions.includes('*')) return true;
      return perms.some((p) => permissions.includes(p));
    },
    [isSuperAdmin, permissions]
  );

  const value = {
    user,
    member,
    role,
    isSuperAdmin,
    permissions,
    loading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    refreshUser: fetchCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
