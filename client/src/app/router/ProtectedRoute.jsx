import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const ProtectedRoute = ({
  children,
  requiredAdmin = false,
  requiredPermission,
  requiredAnyPermission
}) => {
  const { user, loading, isAdmin, hasPermission, hasAnyPermission } = useAuth();
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

  // If this route is restricted to Administrators, redirect normal members/employees to the user dashboard
  if (requiredAdmin && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
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
