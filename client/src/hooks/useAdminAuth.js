import { useAuth } from './useAuth';

export const useAdminAuth = () => {
  const auth = useAuth();
  return {
    ...auth,
    isAdmin: auth.isSuperAdmin || auth.role === 'Admin' || auth.role === 'Super Admin'
  };
};
