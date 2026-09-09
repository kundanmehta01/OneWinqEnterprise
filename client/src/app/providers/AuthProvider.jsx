import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { storage } from '../../utils/storage';

// DEVELOPMENT ONLY: Set VITE_DEV_AUTO_LOGIN=true in .env if you want automatic Super Admin auto-login.
// Defaults to false so that logout, user switching, and invitation acceptance work correctly on all developer machines.
const DEV_AUTO_LOGIN = import.meta.env.VITE_DEV_AUTO_LOGIN === 'true';

const ADMIN_ROLES = ['Super Admin', 'Admin', 'HR Admin', 'Content Admin'];

export const computeRoleAndAdmin = (userObj, memberObj, dataRole, dataIsSuperAdmin, dataPermissions = []) => {
  const email = (userObj?.email || '').toLowerCase().trim();
  const isSuperAdminEmail = email === 'superadmin@onewinq.com';
  const memberRoleName = typeof memberObj?.roleId === 'object' ? memberObj.roleId?.name : (dataRole || null);
  const roleName = isSuperAdminEmail ? 'Super Admin' : (memberRoleName || dataRole || 'Employee');
  const isSuperAdmin = isSuperAdminEmail || roleName === 'Super Admin' || Boolean(dataIsSuperAdmin);
  const isAdmin = isSuperAdmin || ADMIN_ROLES.includes(roleName) || dataPermissions.includes('*') || dataPermissions.includes('dashboard.read');
  return {
    role: roleName,
    isSuperAdmin,
    isAdmin,
    redirectPath: isAdmin ? '/admin/dashboard' : '/user/dashboard'
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());
  const [member, setMember] = useState(null);
  const [role, setRole] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = storage.getAccessToken();

    try {
      if (!token) {
        if (DEV_AUTO_LOGIN) {
          try {
            const loginResult = await authService.login({
              email: 'superadmin@onewinq.com',
              password: 'OneWinq@Admin2026!'
            });
            storage.setAccessToken(loginResult.accessToken);
            if (loginResult.refreshToken) {
              storage.setRefreshToken(loginResult.refreshToken);
            }
            storage.setUser(loginResult.user);
          } catch (loginErr) {
            console.warn('Auto-login with seeded super admin failed:', loginErr);
          }
        } else {
          setUser(null);
          setMember(null);
          setRole(null);
          setIsSuperAdmin(false);
          setPermissions([]);
          return null;
        }
      }

      const data = await authService.getMe();
      const status = computeRoleAndAdmin(
        data.user,
        data.member,
        data.role,
        data.isSuperAdmin,
        data.permissions || []
      );

      setUser(data.user);
      setMember(data.member || null);
      setRole(status.role);
      setIsSuperAdmin(status.isSuperAdmin);
      setPermissions(data.permissions || []);
      storage.setUser(data.user);

      return {
        ...data,
        ...status
      };
    } catch (err) {
      console.warn('Session check warning:', err.message || err);
      if (err.status === 401 || err.code === 'UNAUTHORIZED' || err.code === 'INVALID_TOKEN') {
        storage.clearAuth();
        setUser(null);
        setMember(null);
        setRole(null);
        setIsSuperAdmin(false);
        setPermissions([]);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    const handleAuthExpired = () => {
      storage.clearAuth();
      setUser(null);
      setMember(null);
      setRole(null);
      setIsSuperAdmin(false);
      setPermissions([]);
      setLoading(false);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [fetchCurrentUser]);

  const login = async ({ email, password }) => {
    // 1. Clear previous session state
    storage.clearAuth();
    setUser(null);
    setMember(null);
    setRole(null);
    setIsSuperAdmin(false);
    setPermissions([]);

    // 2. Perform authentication request
    const result = await authService.login({ email, password });
    storage.setAccessToken(result.accessToken);
    if (result.refreshToken) {
      storage.setRefreshToken(result.refreshToken);
    }
    storage.setUser(result.user);

    // 3. Compute role and admin status from login payload
    const initialStatus = computeRoleAndAdmin(result.user, result.member);
    setUser(result.user);
    setMember(result.member || null);
    setRole(initialStatus.role);
    setIsSuperAdmin(initialStatus.isSuperAdmin);

    // 4. Enrich permissions via getMe without breaking session if getMe fails
    try {
      const meData = await authService.getMe();
      if (meData?.user) {
        const enrichedStatus = computeRoleAndAdmin(
          meData.user,
          meData.member || result.member,
          meData.role,
          meData.isSuperAdmin,
          meData.permissions || []
        );
        setUser(meData.user);
        setMember(meData.member || result.member || null);
        setRole(enrichedStatus.role);
        setIsSuperAdmin(enrichedStatus.isSuperAdmin);
        setPermissions(meData.permissions || []);
        storage.setUser(meData.user);

        return {
          ...result,
          user: meData.user,
          member: meData.member || result.member,
          role: enrichedStatus.role,
          isAdmin: enrichedStatus.isAdmin,
          isSuperAdmin: enrichedStatus.isSuperAdmin,
          redirectPath: enrichedStatus.redirectPath
        };
      }
    } catch (enrichErr) {
      console.warn('Post-login enrichment skipped:', enrichErr.message || enrichErr);
    }

    return {
      ...result,
      role: initialStatus.role,
      isAdmin: initialStatus.isAdmin,
      isSuperAdmin: initialStatus.isSuperAdmin,
      redirectPath: initialStatus.redirectPath
    };
  };

  const logout = async () => {
    try {
      const refreshToken = storage.getRefreshToken();
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      storage.clearAuth();
      setUser(null);
      setMember(null);
      setRole(null);
      setIsSuperAdmin(false);
      setPermissions([]);
      setLoading(false);
    }
  };

  const currentStatus = computeRoleAndAdmin(user, member, role, isSuperAdmin, permissions);

  const hasPermission = useCallback(
    (perm) => {
      if (currentStatus.isSuperAdmin || permissions.includes('*')) return true;
      return permissions.includes(perm);
    },
    [currentStatus.isSuperAdmin, permissions]
  );

  const hasAnyPermission = useCallback(
    (perms = []) => {
      if (currentStatus.isSuperAdmin || permissions.includes('*')) return true;
      return perms.some((p) => permissions.includes(p));
    },
    [currentStatus.isSuperAdmin, permissions]
  );

  const value = {
    user,
    member,
    role: currentStatus.role,
    isAdmin: currentStatus.isAdmin,
    isSuperAdmin: currentStatus.isSuperAdmin,
    permissions,
    loading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    refreshUser: fetchCurrentUser,
    redirectPath: currentStatus.redirectPath
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
