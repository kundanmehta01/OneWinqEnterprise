import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { PublicCompanyPage } from './pages/PublicCompanyPage';
import { PublicEmployeeProfilePage } from './pages/PublicEmployeeProfilePage';
import { CardActivationPage } from './pages/CardActivationPage';
import { PublicCardTapPage } from './pages/PublicCardTapPage';
import { AcceptInvitationPage } from './pages/AcceptInvitationPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';

// 1. Organization Admin Layout & Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { CompanyProfileStudioPage } from './pages/admin/CompanyProfileStudioPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminDepartmentsPage } from './pages/admin/AdminDepartmentsPage';
import { AdminRolesPage } from './pages/admin/AdminRolesPage';
import { AdminInvitationsPage } from './pages/admin/AdminInvitationsPage';
import { AdminTemplatesPage } from './pages/admin/AdminTemplatesPage';
import { AdminProfileApprovalPage } from './pages/admin/AdminProfileApprovalPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminCardsPage } from './pages/admin/AdminCardsPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';

// 2. User / Employee Portal Layout & Pages (Matching the 3 Screenshots)
import { UserLayout } from './pages/user/UserLayout';
import { UserHomePage } from './pages/admin/UserHomePage';
import { EmployeeSelfProfilePage } from './pages/admin/EmployeeSelfProfilePage';
import { ColleagueNetworkPage } from './pages/admin/ColleagueNetworkPage';
import { TeamDepartmentsPage } from './pages/admin/TeamDepartmentsPage';
import { UserEventsPage } from './pages/user/UserEventsPage';
import { EmployeeSettingsPage } from './pages/user/EmployeeSettingsPage';

import { PERMISSIONS, ADMIN_PERMISSIONS, hasAdminAccess } from './utils/permissions';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// User Portal Guard (Redirects pure SuperAdmin without employee identity directly to Admin side)
const UserPortalRoute = ({ children }) => {
  const { isSuperAdmin, member } = useAuthStore();
  if (isSuperAdmin && !member) {
    return <Navigate to="/admin/company-profile" replace />;
  }
  return children;
};

// Admin Permission Route Guard (Redirects non-admin users to /app/home)
const AdminPermissionRoute = ({ permission, children }) => {
  const { isSuperAdmin, permissions } = useAuthStore();
  if (isSuperAdmin) return children;
  const userPerms = Array.isArray(permissions) ? permissions : [];

  // If no specific permission requested, verify general administrative role/access
  if (!permission) {
    if (!hasAdminAccess(userPerms, isSuperAdmin)) {
      return <Navigate to="/app/home" replace />;
    }
    return children;
  }

  const hasAccess = Array.isArray(permission)
    ? permission.some((p) => userPerms.includes(p))
    : userPerms.includes(permission);

  if (!hasAccess) {
    return <Navigate to="/app/home" replace />;
  }
  return children;
};

// Smart index redirect for role-based panel entrance
const AdminIndexRedirect = () => {
  const { isSuperAdmin, permissions } = useAuthStore();
  if (isSuperAdmin) return <Navigate to="/admin/dashboard" replace />;
  const perms = Array.isArray(permissions) ? permissions : [];

  if (perms.includes('dashboard.read')) return <Navigate to="/admin/dashboard" replace />;
  if (perms.includes('team.read')) return <Navigate to="/admin/team" replace />;
  if (perms.includes('department.read')) return <Navigate to="/admin/departments" replace />;
  if (perms.includes('profile_approval.read') || perms.includes('profile_approval.approve')) return <Navigate to="/admin/approvals" replace />;
  if (perms.includes('invitation.read') || perms.includes('invitation.create')) return <Navigate to="/admin/invitations" replace />;
  if (perms.includes('company_profile.read') || perms.includes('company_profile.update')) return <Navigate to="/admin/company-profile" replace />;
  if (perms.includes('template.read')) return <Navigate to="/admin/templates" replace />;
  if (perms.includes('event.read') || perms.includes('event.create') || perms.includes('event.update')) return <Navigate to="/admin/events" replace />;
  if (perms.includes('analytics.read')) return <Navigate to="/admin/analytics" replace />;
  if (perms.includes('card.read')) return <Navigate to="/admin/cards" replace />;
  if (perms.includes('role.read')) return <Navigate to="/admin/roles" replace />;
  if (perms.includes('settings.read')) return <Navigate to="/admin/settings" replace />;

  return <Navigate to="/app/home" replace />;
};

export const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* 1. Public Company Identity Flow */}
      <Route path="/" element={<PublicCompanyPage />} />
      <Route path="/company" element={<PublicCompanyPage />} />
      <Route path="/p/company" element={<PublicCompanyPage />} />

      {/* 2. Public Employee Digital Profile & NFC Tap Flow */}
      <Route path="/p/:slug" element={<PublicEmployeeProfilePage />} />
      <Route path="/profile/:slug" element={<PublicEmployeeProfilePage />} />
      <Route path="/profiles/:slug" element={<PublicEmployeeProfilePage />} />

      {/* 2.1 Public Smart / NFC Card Tap Resolver */}
      <Route path="/c/:cardUid" element={<PublicCardTapPage />} />
      <Route path="/card/:cardUid" element={<PublicCardTapPage />} />
      <Route path="/cards/:cardUid" element={<PublicCardTapPage />} />

      {/* 2.2 Secure Card Activation Flow */}
      <Route path="/card/activate/:token" element={<CardActivationPage />} />
      <Route path="/cards/activate/:token" element={<CardActivationPage />} />
      <Route path="/app/card/activate/:token" element={<CardActivationPage />} />

      {/* 3. Employee Invitation & Onboarding Flow */}
      <Route path="/invite/:token" element={<AcceptInvitationPage />} />
      <Route path="/invite/accept" element={<AcceptInvitationPage />} />
      <Route path="/join/:token" element={<AcceptInvitationPage />} />

      {/* 4. Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/login" element={<AdminLoginPage />} />

      {/* 5. USER / EMPLOYEE PORTAL (Dedicated User Side) */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <UserPortalRoute>
              <UserLayout />
            </UserPortalRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/home" replace />} />
        <Route path="home" element={<UserHomePage />} />
        <Route path="my-profile" element={<EmployeeSelfProfilePage />} />
        <Route path="network" element={<ColleagueNetworkPage />} />
        <Route path="team-departments" element={<TeamDepartmentsPage />} />
        <Route path="events" element={<UserEventsPage />} />
        <Route path="settings" element={<EmployeeSettingsPage />} />
      </Route>

      {/* 6. ORGANIZATION ADMIN CONSOLE (Dedicated Admin Side) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPermissionRoute>
              <AdminLayout />
            </AdminPermissionRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminIndexRedirect />} />
        <Route
          path="dashboard"
          element={
            <AdminPermissionRoute permission="dashboard.read">
              <AdminDashboardPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="cards"
          element={
            <AdminPermissionRoute permission="card.read">
              <AdminCardsPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="company-profile"
          element={
            <AdminPermissionRoute permission={['company_profile.read', 'company_profile.update']}>
              <CompanyProfileStudioPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="organization"
          element={
            <AdminPermissionRoute permission={['company_profile.read', 'company_profile.update']}>
              <CompanyProfileStudioPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="team"
          element={
            <AdminPermissionRoute permission="team.read">
              <AdminTeamPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="departments"
          element={
            <AdminPermissionRoute permission="department.read">
              <AdminDepartmentsPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="roles"
          element={
            <AdminPermissionRoute permission="role.read">
              <AdminRolesPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="invitations"
          element={
            <AdminPermissionRoute permission={['invitation.read', 'invitation.create']}>
              <AdminInvitationsPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="templates"
          element={
            <AdminPermissionRoute permission="template.read">
              <AdminTemplatesPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="approvals"
          element={
            <AdminPermissionRoute permission={['profile_approval.read', 'profile_approval.approve']}>
              <AdminProfileApprovalPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <AdminPermissionRoute permission="analytics.read">
              <AdminAnalyticsPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="settings"
          element={
            <AdminPermissionRoute permission={['settings.read', 'settings.update']}>
              <AdminSettingsPage />
            </AdminPermissionRoute>
          }
        />
        <Route
          path="events"
          element={
            <AdminPermissionRoute permission={['event.read', 'event.create', 'event.update']}>
              <AdminEventsPage />
            </AdminPermissionRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
