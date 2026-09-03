import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../../components/common/Button';

// TEMPORARY DEVELOPMENT BYPASS: set to false when invitation-based admin auth is ready.
const TEMP_ADMIN_AUTH_BYPASS = false;

export const ProtectedRoute = ({ children, requiredPermission, requiredAnyPermission }) => {
  const { user, loading, hasPermission, hasAnyPermission } = useAuth();
  const location = useLocation();

  // TEMPORARY DEVELOPMENT BYPASS: keep the full auth and permission logic below intact.
  if (TEMP_ADMIN_AUTH_BYPASS) {
    return children;
  }

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

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
          Your account role does not have authorization to view or manage this module.
        </p>
        <Button onClick={() => window.history.back()} variant="secondary">
          Go Back
        </Button>
      </div>
    );
  }

  if (requiredAnyPermission && !hasAnyPermission(requiredAnyPermission)) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
          Your account role does not have authorization to view this module.
        </p>
        <Button onClick={() => window.history.back()} variant="secondary">
          Go Back
        </Button>
      </div>
    );
  }

  return children;
};
