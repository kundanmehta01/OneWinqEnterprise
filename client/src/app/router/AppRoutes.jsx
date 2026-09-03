import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts (use Outlet internally)
import { AdminLayout } from '../../layouts/AdminLayout';
import { UserLayout } from '../../layouts/UserLayout';

// Auth Pages
import { LoginPage } from '../../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../../pages/auth/ResetPasswordPage';
import { AcceptInvitationPage } from '../../pages/auth/AcceptInvitationPage';

// Admin Pages
import { DashboardPage } from '../../pages/admin/DashboardPage';
import { TeamMembersPage } from '../../pages/admin/TeamMembersPage';
import { TemplatesPage } from '../../pages/admin/TemplatesPage';
import { RolesPage } from '../../pages/admin/RolesPage';
import { AnalyticsPage } from '../../pages/admin/AnalyticsPage';
import { DepartmentsPage } from '../../pages/admin/DepartmentsPage';
import { ProfileApprovalsPage } from '../../pages/admin/ProfileApprovalsPage';
import { InvitationsPage } from '../../pages/admin/InvitationsPage';
import { CompanyProfilePage } from '../../pages/admin/CompanyProfilePage';
import { AuditLogsPage } from '../../pages/admin/AuditLogsPage';
import { SettingsPage } from '../../pages/admin/SettingsPage';

// User Pages
import { UserDashboardPage } from '../../pages/user/UserDashboardPage';
import { MyProfilePage } from '../../pages/user/MyProfilePage';
import { MyNotificationsPage } from '../../pages/user/MyNotificationsPage';

// Public Pages
import { PublicCompanyPage } from '../../pages/public/PublicCompanyPage';
import { PublicProfilePage } from '../../pages/public/PublicProfilePage';
import { NotFoundPage } from '../../pages/public/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ===== ROOT REDIRECT ===== */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* ===== AUTH ROUTES (no auth required) ===== */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
      {/* Support /auth/* prefix as well */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/accept-invitation" element={<AcceptInvitationPage />} />

      {/* ===== PUBLIC DIGITAL BUSINESS CARD PAGES ===== */}
      <Route path="/p/company" element={<PublicCompanyPage />} />
      <Route path="/p/:slug" element={<PublicProfilePage />} />

      {/* ===== ADMIN PORTAL (AdminLayout uses <Outlet />) ===== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

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
          path="company-profile"
          element={
            <ProtectedRoute requiredAnyPermission={['company_profile.read', 'company_profile.update']}>
              <CompanyProfilePage />
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

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ===== EMPLOYEE PORTAL (UserLayout uses <Outlet />) ===== */}
      <Route
        path="/me"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboardPage />} />
        <Route path="profile" element={<MyProfilePage />} />
        <Route path="notifications" element={<MyNotificationsPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* ===== CATCH-ALL 404 ===== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
