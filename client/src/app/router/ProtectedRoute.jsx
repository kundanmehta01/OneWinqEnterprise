import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getDashboardPath } from '../providers/AuthProvider';

export const ProtectedRoute = ({
  children,
  requiredSuperAdmin = false,
  requiredAdmin = false,
  requiredPermission,
  requiredAnyPermission
}) => {
  const { user, loading, isSuperAdmin, isAdmin, role, hasPermission, hasAnyPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
        <LoadingSpinner message="Checking security credentials..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const fallbackDashboard = getDashboardPath(role, isSuperAdmin, user?.email);

  // 1. Super Admin Protection: Only SUPER_ADMIN can access.
  if (requiredSuperAdmin && !isSuperAdmin) {
    return (
      <Navigate
        to={fallbackDashboard}
        state={{
          permissionDenied: true,
          message: "You don't have permission to access this page."
        }}
        replace
      />
    );
  }

  // 2. Admin Protection: Restricted to Admin / Super Admin roles only.
  if (requiredAdmin && !isAdmin) {
    return (
      <Navigate
        to={fallbackDashboard}
        state={{
          permissionDenied: true,
          message: "You don't have permission to access this page."
        }}
        replace
      />
    );
  }

  // 3. Permission checks
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Navigate
        to={fallbackDashboard}
        state={{
          permissionDenied: true,
          message: "You don't have permission to access this page."
        }}
        replace
      />
    );
  }

  if (requiredAnyPermission && !hasAnyPermission(requiredAnyPermission)) {
    return (
      <Navigate
        to={fallbackDashboard}
        state={{
          permissionDenied: true,
          message: "You don't have permission to access this page."
        }}
        replace
      />
    );
  }

  return children;
};
