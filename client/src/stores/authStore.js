import { create } from 'zustand';
import { authApi } from '../api/authApi';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('onewinq_user') || 'null'),
  member: JSON.parse(localStorage.getItem('onewinq_member') || 'null'),
  role: localStorage.getItem('onewinq_role') || null,
  isSuperAdmin: localStorage.getItem('onewinq_is_super_admin') === 'true',
  permissions: JSON.parse(localStorage.getItem('onewinq_permissions') || '[]'),
  accessToken: localStorage.getItem('onewinq_access_token') || null,
  refreshToken: localStorage.getItem('onewinq_refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('onewinq_access_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login({ email, password });
      const { user, member, accessToken, refreshToken } = data;

      // Fetch permissions via getMe
      localStorage.setItem('onewinq_access_token', accessToken);
      localStorage.setItem('onewinq_refresh_token', refreshToken);
      localStorage.setItem('onewinq_user', JSON.stringify(user));
      localStorage.setItem('onewinq_member', JSON.stringify(member));

      const meData = await authApi.getMe();
      const role = meData.role;
      const isSuperAdmin = meData.isSuperAdmin;
      const permissions = meData.permissions || [];

      localStorage.setItem('onewinq_role', role);
      localStorage.setItem('onewinq_is_super_admin', String(isSuperAdmin));
      localStorage.setItem('onewinq_permissions', JSON.stringify(permissions));

      set({
        user,
        member,
        role,
        isSuperAdmin,
        permissions,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return data;
    } catch (err) {
      set({
        isLoading: false,
        error: err.message || 'Login failed',
      });
      throw err;
    }
  },

  logout: async () => {
    try {
      const refreshToken = get().refreshToken;
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (e) {
      console.warn('Logout server call error:', e);
    } finally {
      localStorage.removeItem('onewinq_access_token');
      localStorage.removeItem('onewinq_refresh_token');
      localStorage.removeItem('onewinq_user');
      localStorage.removeItem('onewinq_member');
      localStorage.removeItem('onewinq_role');
      localStorage.removeItem('onewinq_is_super_admin');
      localStorage.removeItem('onewinq_permissions');

      set({
        user: null,
        member: null,
        role: null,
        isSuperAdmin: false,
        permissions: [],
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      });
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('onewinq_access_token');
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const meData = await authApi.getMe();
      const role = meData.role;
      const isSuperAdmin = meData.isSuperAdmin;
      const permissions = meData.permissions || [];

      localStorage.setItem('onewinq_role', role);
      localStorage.setItem('onewinq_is_super_admin', String(isSuperAdmin));
      localStorage.setItem('onewinq_permissions', JSON.stringify(permissions));
      if (meData.user) localStorage.setItem('onewinq_user', JSON.stringify(meData.user));
      if (meData.member) localStorage.setItem('onewinq_member', JSON.stringify(meData.member));

      set({
        user: meData.user,
        member: meData.member,
        role,
        isSuperAdmin,
        permissions,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      console.warn('Session verification failed, resetting auth state');
      get().logout();
      set({ isLoading: false });
    }
  },

  // Granular setters for use after invitation acceptance
  setUser: (user) => {
    if (user) localStorage.setItem('onewinq_user', JSON.stringify(user));
    set({ user });
  },
  setMember: (member) => {
    if (member) localStorage.setItem('onewinq_member', JSON.stringify(member));
    set({ member });
  },
  setRole: (role) => {
    if (role) localStorage.setItem('onewinq_role', role);
    set({ role });
  },
  setPermissions: (permissions) => {
    localStorage.setItem('onewinq_permissions', JSON.stringify(permissions || []));
    set({ permissions: permissions || [] });
  },
  setIsSuperAdmin: (isSuperAdmin) => {
    localStorage.setItem('onewinq_is_super_admin', String(isSuperAdmin));
    set({ isSuperAdmin });
  },
}));

// Listen to expired token event
if (typeof window !== 'undefined') {
  window.addEventListener('onewinq_auth_expired', () => {
    useAuthStore.getState().logout();
  });
}
