import { QueryClient } from '@tanstack/react-query';

/**
 * Singleton QueryClient shared between main.jsx (provider) and authStore.js (cache invalidation on logout).
 * Exporting it here avoids circular dependency and allows the auth store to call
 * queryClient.clear() on logout so stale per-user cache never bleeds into the next session.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3, // 3 minutes
      retry: 1,
    },
  },
});
