import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { UserLayout } from '../layouts/UserLayout';
import UserDashboard from '../pages/UserDashboard';
import Teams from '../pages/Teams';
import Events from '../pages/Events';
import Messages from '../pages/Messages';
import Notifications from '../pages/Notifications';
import MyProfile from '../pages/MyProfile';
import EditProfile from '../pages/EditProfile';
import DigitalCard from '../pages/DigitalCard';
import Network from '../pages/Network';
import CompanyProfile from '../pages/CompanyProfile';
import Settings from '../pages/Settings';
import HelpSupport from '../pages/HelpSupport';

export const UserRouteElements = () => (
  <>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<UserDashboard />} />
    <Route path="profile" element={<MyProfile />} />
    <Route path="edit-profile" element={<EditProfile />} />
    <Route path="card" element={<DigitalCard />} />
    <Route path="digital-card" element={<DigitalCard />} />
    <Route path="network" element={<Network />} />
    <Route path="teams" element={<Teams />} />
    <Route path="team" element={<Teams />} />
    <Route path="company" element={<CompanyProfile />} />
    <Route path="events" element={<Events />} />
    <Route path="messages" element={<Messages />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="settings" element={<Settings />} />
    <Route path="help" element={<HelpSupport />} />
    <Route path="*" element={<Navigate to="dashboard" replace />} />
  </>
);
