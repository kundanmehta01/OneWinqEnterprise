import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserLayout } from '../../layouts/UserLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { UserDashboardPage } from '../../pages/user/UserDashboardPage';
import { MyProfilePage } from '../../pages/user/MyProfilePage';
import { MyNotificationsPage } from '../../pages/user/MyNotificationsPage';

export const UserRoutes = () => {
  return (
    <ProtectedRoute>
      <UserLayout>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboardPage />} />
          <Route path="profile" element={<MyProfilePage />} />
          <Route path="notifications" element={<MyNotificationsPage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </UserLayout>
    </ProtectedRoute>
  );
};
