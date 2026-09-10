import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { storage } from '../../utils/storage';

// DEVELOPMENT ONLY: Set VITE_DEV_AUTO_LOGIN=true in .env if you want automatic Super Admin auto-login.
// Defaults to false so that logout, user switching, and invitation acceptance work correctly on all developer machines.
const DEV_AUTO_LOGIN = import.meta.env.VITE_DEV_AUTO_LOGIN === 'true';

const SUPER_ADMIN_EMAILS = ['superadmin@onewinq.com', 'superadmin@gmail.com'];
const ADMIN_ROLES = ['Super Admin', 'SUPER_ADMIN', 'Admin', 'ADMIN', 'HR Admin', 'HR_ADMIN', 'Content Admin', 'CONTENT_ADMIN'];

const parseJwt = (token) => {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Identify destination dashboard URL strictly by role and identity.
 * Super Admin -> /admin/dashboard
 * Employee / Team Member / Normal User -> /user/dashboard
 */
export const getDashboardPath = (role, isSuperAdmin, email) => {
  const normEmail = (email || '').toLowerCase().trim();
  const isSuper = Boolean(
    isSuperAdmin ||
    SUPER_ADMIN_EMAILS.includes(normEmail) ||
    (role && (role.toUpperCase() === 'SUPER_ADMIN' || role.toUpperCase() === 'SUPER ADMIN'))
  );

  if (isSuper) {
    return '/admin/dashboard';
  }

  const normRole = (role || '').toUpperCase().trim();
  if (
    normRole === 'ADMIN' ||
    normRole === 'HR ADMIN' ||
    normRole === 'CONTENT ADMIN' ||
    normRole === 'HR_ADMIN' ||
    normRole === 'CONTENT_ADMIN'
  ) {
    return '/admin/dashboard';
  }

  // All employees, members, and normal users go to User Dashboard
  return '/user/dashboard';
};

/**
 * Builds standard enterprise user profile containing all required user data fields.
 * Strictly guarantees that non-superadmin emails can never be elevated to SUPER_ADMIN.
 */
export const buildUserProfile = (userObj, memberObj, roleName, isSuper, permissions = []) => {
  const normEmail = (userObj?.email || '').toLowerCase().trim();
  const isSuperVerified = Boolean(
    isSuper ||
    SUPER_ADMIN_EMAILS.includes(normEmail) ||
    roleName === 'Super Admin' ||
    roleName === 'SUPER_ADMIN'
  );

  let finalRole = roleName || 'EMPLOYEE';
  if (isSuperVerified) {
    finalRole = 'SUPER_ADMIN';
  } else if (finalRole === 'SUPER_ADMIN' || finalRole === 'Super Admin') {
    finalRole = 'EMPLOYEE';
  }

  const name = memberObj?.name || userObj?.name || (normEmail ? normEmail.split('@')[0] : 'User');
  const profileImage = memberObj?.profileId?.published?.avatarUrl || memberObj?.profileId?.published?.avatar || memberObj?.profileImage || memberObj?.avatar || null;
  const department = typeof memberObj?.departmentId === 'object' ? (memberObj.departmentId?.name || 'General') : (memberObj?.department || 'General');
  const company = memberObj?.companyId?.name || memberObj?.company || 'OneWinq Enterprise';
  const designation = memberObj?.designation || (isSuperVerified ? 'Super Administrator' : 'Team Member');

  const isAdmin = isSuperVerified || ['Admin', 'ADMIN', 'HR Admin', 'HR_ADMIN', 'Content Admin', 'CONTENT_ADMIN'].includes(finalRole) || permissions.includes('*') || permissions.includes('dashboard.read');

  return {
    id: userObj?._id || userObj?.id,
    name,
    email: normEmail,
    role: finalRole,
    permissions: isSuperVerified ? ['*'] : permissions,
    profileImage,
    department,
    company,
    designation,
    isSuperAdmin: isSuperVerified,
    isAdmin
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

    if (!token) {
      setUser(null);
      setMember(null);
      setRole(null);
      setIsSuperAdmin(false);
      setPermissions([]);
      setLoading(false);
      return null;
    }

    const tokenPayload = parseJwt(token);
    const tokenEmail = (tokenPayload?.email || '').toLowerCase().trim();
    const storedUser = storage.getUser();
    const isSuper = SUPER_ADMIN_EMAILS.includes(tokenEmail);

    try {
      let data = null;
      try {
        data = await authService.getMe();
      } catch (getMeErr) {
        console.warn('Session getMe warning:', getMeErr.message || getMeErr);
      }

      const meEmail = (data?.user?.email || '').toLowerCase().trim();
      // Guard against backend development bypass: only accept getMe data if it matches the authenticated token email
      const isMeValid = data?.user && (!tokenEmail || meEmail === tokenEmail);

      let targetUser = storedUser;
      let targetMember = null;
      let targetRole = storedUser?.role || 'EMPLOYEE';
      let targetPerms = storedUser?.permissions || [];

      if (isMeValid) {
        targetUser = data.user;
        targetMember = data.member;
        targetRole = isSuper ? 'SUPER_ADMIN' : (data.role || data.member?.roleId?.name || 'EMPLOYEE');
        targetPerms = data.permissions || [];
      } else if (storedUser && (!tokenEmail || (storedUser.email || '').toLowerCase().trim() === tokenEmail)) {
        targetUser = storedUser;
        targetRole = isSuper ? 'SUPER_ADMIN' : (storedUser.role || 'EMPLOYEE');
        targetPerms = storedUser.permissions || [];
      } else if (tokenEmail) {
        targetUser = { email: tokenEmail, name: tokenEmail.split('@')[0] };
        targetRole = isSuper ? 'SUPER_ADMIN' : 'EMPLOYEE';
      }

      const userProfile = buildUserProfile(
        targetUser,
        targetMember,
        targetRole,
        isSuper,
        targetPerms
      );

      setUser(userProfile);
      setMember(targetMember);
      setRole(userProfile.role);
      setIsSuperAdmin(userProfile.isSuperAdmin);
      setPermissions(userProfile.permissions);
      storage.setUser(userProfile);

      return {
        userProfile,
        role: userProfile.role,
        isAdmin: userProfile.isAdmin,
        isSuperAdmin: userProfile.isSuperAdmin,
        redirectPath: getDashboardPath(userProfile.role, userProfile.isSuperAdmin, userProfile.email)
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
    storage.clearAuth();
    setUser(null);
    setMember(null);
    setRole(null);
    setIsSuperAdmin(false);
    setPermissions([]);

    const result = await authService.login({ email, password });
    storage.setAccessToken(result.accessToken);
    if (result.refreshToken) {
      storage.setRefreshToken(result.refreshToken);
    }

    const normEmail = (result.user?.email || email || '').toLowerCase().trim();
    const isSuper = SUPER_ADMIN_EMAILS.includes(normEmail);
    const rawRole = isSuper ? 'SUPER_ADMIN' : (result.member?.roleId?.name || result.role || 'EMPLOYEE');
    const profile = buildUserProfile(result.user, result.member, rawRole, isSuper, isSuper ? ['*'] : (result.member?.roleId?.permissions || []));

    setUser(profile);
    setMember(result.member || null);
    setRole(profile.role);
    setIsSuperAdmin(profile.isSuperAdmin);
    setPermissions(profile.permissions);
    storage.setUser(profile);

    // Only accept getMe data if it actually belongs to the authenticated user's email
    try {
      const meData = await authService.getMe();
      const meEmail = (meData?.user?.email || '').toLowerCase().trim();
      if (meData?.user && meEmail === normEmail) {
        const enrichedRole = isSuper ? 'SUPER_ADMIN' : (meData.role || meData.member?.roleId?.name || rawRole);
        const enrichedProfile = buildUserProfile(
          meData.user,
          meData.member || result.member,
          enrichedRole,
          isSuper,
          meData.permissions || profile.permissions
        );

        setUser(enrichedProfile);
        setMember(meData.member || result.member || null);
        setRole(enrichedProfile.role);
        setIsSuperAdmin(enrichedProfile.isSuperAdmin);
        setPermissions(enrichedProfile.permissions);
        storage.setUser(enrichedProfile);

        return {
          ...result,
          user: enrichedProfile,
          member: meData.member || result.member,
          role: enrichedProfile.role,
          isAdmin: enrichedProfile.isAdmin,
          isSuperAdmin: enrichedProfile.isSuperAdmin,
          redirectPath: getDashboardPath(enrichedProfile.role, enrichedProfile.isSuperAdmin, enrichedProfile.email)
        };
      }
    } catch (enrichErr) {
      console.warn('Post-login enrichment skipped:', enrichErr.message || enrichErr);
    }

    const redirectPath = getDashboardPath(profile.role, profile.isSuperAdmin, profile.email);
    return {
      ...result,
      user: profile,
      role: profile.role,
      isAdmin: profile.isAdmin,
      isSuperAdmin: profile.isSuperAdmin,
      redirectPath
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

  const effectiveProfile = user || buildUserProfile(user, member, role, isSuperAdmin, permissions);
  const effectiveRedirectPath = getDashboardPath(effectiveProfile.role, effectiveProfile.isSuperAdmin, effectiveProfile.email);

  const hasPermission = useCallback(
    (perm) => {
      if (effectiveProfile.isSuperAdmin || permissions.includes('*')) return true;
      return permissions.includes(perm);
    },
    [effectiveProfile.isSuperAdmin, permissions]
  );

  const hasAnyPermission = useCallback(
    (perms = []) => {
      if (effectiveProfile.isSuperAdmin || permissions.includes('*')) return true;
      return perms.some((p) => permissions.includes(p));
    },
    [effectiveProfile.isSuperAdmin, permissions]
  );

  const value = {
    user: effectiveProfile,
    member,
    role: effectiveProfile.role,
    isAdmin: effectiveProfile.isAdmin,
    isSuperAdmin: effectiveProfile.isSuperAdmin,
    permissions,
    loading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    refreshUser: fetchCurrentUser,
    redirectPath: effectiveRedirectPath
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
