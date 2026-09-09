import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// Layouts (use Outlet internally)
import { AdminLayout } from '../../layouts/AdminLayout';
import { UserLayout } from '../../user/layouts/UserLayout';
import { UserRouteElements } from '../../user/routes/userRoutes';

// Auth Pages
import { LoginPage } from '../../pages/auth/LoginPage';
import { RegisterPage } from '../../pages/auth/RegisterPage';
import { VerifyOTPPage } from '../../pages/auth/VerifyOTPPage';
import { ForgotPasswordPage } from '../../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../../pages/auth/ResetPasswordPage';
import { AcceptInvitationPage } from '../../pages/auth/AcceptInvitationPage';

// Admin Pages
import { DashboardPage } from '../../pages/admin/DashboardPage';
import { TeamMembersPage } from '../../pages/admin/TeamMembersPage';
import { TemplatesPage } from '../../pages/admin/TemplatesPage';
import { RolesPage } from '../../pages/admin/RolesPage';
import { PermissionsPage } from '../../pages/admin/Permissions';
import { AnalyticsPage } from '../../pages/admin/AnalyticsPage';
import { DepartmentsPage } from '../../pages/admin/DepartmentsPage';
import { ProfileApprovalsPage } from '../../pages/admin/ProfileApprovalsPage';
import { InvitationsPage } from '../../pages/admin/InvitationsPage';
import CompanyProfile from '../../pages/admin/company-profile/CompanyProfile';
import { AuditLogsPage } from '../../pages/admin/AuditLogsPage';
import { SettingsPage } from '../../pages/admin/SettingsPage';
import { NotificationsPage } from '../../pages/admin/NotificationsPage';
import { EmployeeProfilesPage } from '../../pages/admin/EmployeeProfilesPage';
import MediaGallery from '../../pages/admin/media/MediaGallery';

// Public Pages
import { PublicCompanyPage } from '../../pages/public/PublicCompanyPage';
import { PublicProfilePage } from '../../pages/public/PublicProfilePage';
import { NotFoundPage } from '../../pages/public/NotFoundPage';

/**
 * Smart Root Redirect
 * Directs unauthenticated users to /login,
 * Administrators to /admin/dashboard,
 * and Employees/Members to /user/dashboard.
 */
const RootRedirect = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FC]">
        <LoadingSpinner message="Loading your workspace..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={isAdmin ? '/admin/dashboard' : '/user/dashboard'} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== ROOT REDIRECT (Role & Session Aware) ===== */}
      <Route path="/" element={<RootRedirect />} />

      {/* ===== AUTH & INVITATION ROUTES (no auth required) ===== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Complete invitation acceptance URLs supported by backend & links */}
      <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
      <Route path="/invite/accept" element={<AcceptInvitationPage />} />
      <Route path="/invitations/accept" element={<AcceptInvitationPage />} />
      <Route path="/invite" element={<AcceptInvitationPage />} />
      <Route path="/invitation/accept" element={<AcceptInvitationPage />} />
      <Route path="/invitation" element={<AcceptInvitationPage />} />

      {/* Support /auth/* prefix as well */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/verify-otp" element={<VerifyOTPPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/accept-invitation" element={<AcceptInvitationPage />} />
      <Route path="/auth/invite/accept" element={<AcceptInvitationPage />} />

      {/* ===== PUBLIC DIGITAL BUSINESS CARD PAGES ===== */}
      <Route path="/p/company" element={<PublicCompanyPage />} />
      <Route path="/p/:slug" element={<PublicProfilePage />} />

      {/* ===== ADMIN PORTAL (Restricted to Admin / Super Admin roles only) ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requiredPermission="dashboard.read">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="team-members"
          element={
            <ProtectedRoute requiredAnyPermission={['team.read', 'team.create', 'team.update', 'team.delete']}>
              <TeamMembersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="departments"
          element={
            <ProtectedRoute requiredAnyPermission={['department.read', 'department.create']}>
              <DepartmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="roles"
          element={
            <ProtectedRoute requiredAnyPermission={['role.read', 'role.create']}>
              <RolesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="permissions"
          element={
            <ProtectedRoute requiredPermission="role.read">
              <PermissionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="templates"
          element={
            <ProtectedRoute requiredAnyPermission={['template.read', 'template.create']}>
              <TemplatesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile-approvals"
          element={
            <ProtectedRoute requiredAnyPermission={['profile_approval.read', 'profile_approval.approve']}>
              <ProfileApprovalsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="invitations"
          element={
            <ProtectedRoute requiredAnyPermission={['invitation.read', 'invitation.create']}>
              <InvitationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="analytics"
          element={
            <ProtectedRoute requiredPermission="analytics.read">
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="media"
          element={
            <ProtectedRoute requiredPermission="media.read">
              <MediaGallery />
            </ProtectedRoute>
          }
        />

        <Route
          path="company-profile"
          element={
            <ProtectedRoute requiredAnyPermission={['company_profile.read', 'company_profile.update']}>
              <CompanyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="audit-logs"
          element={
            <ProtectedRoute requiredPermission="audit_log.read">
              <AuditLogsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute requiredAnyPermission={['settings.read', 'settings.update']}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="employee-profiles"
          element={
            <ProtectedRoute requiredAnyPermission={['team.read', 'profile_approval.read']}>
              <EmployeeProfilesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route path="approvals" element={<Navigate to="/admin/profile-approvals" replace />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ===== USER / EMPLOYEE DIGITAL IDENTITY PLATFORM (Both /user and /me supported) ===== */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        {UserRouteElements()}
      </Route>

      <Route
        path="/me"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        {UserRouteElements()}
      </Route>

      {/* ===== CATCH-ALL 404 ===== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
