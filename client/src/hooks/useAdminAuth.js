import { useAuth } from './useAuth';

export const useAdminAuth = () => {
  const auth = useAuth();
  return {
    ...auth,
    isAdmin: auth.isSuperAdmin
  };
};
