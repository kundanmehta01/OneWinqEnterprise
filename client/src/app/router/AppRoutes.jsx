import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import Dashboard from '../../pages/admin/Dashboard'
import TeamMembers from '../../pages/admin/TeamMembers'
import Templates from '../../pages/admin/Templates'
import RolesPermissions from '../../pages/admin/RolesPermissions'
import ProfileApproval from '../../pages/admin/ProfileApproval'
import Analytics from '../../pages/admin/Analytics'
import AuditLogs from '../../pages/admin/AuditLogs'
import CompanyProfile from '../../pages/admin/CompanyProfile'
import Departments from '../../pages/admin/Departments'
import Invitations from '../../pages/admin/Invitations'
import GeneralSettings from '../../pages/admin/GeneralSettings'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="team-members" element={<TeamMembers />} />
        <Route path="templates" element={<Templates />} />
        <Route path="roles-permissions" element={<RolesPermissions />} />
        <Route path="profile-approvals" element={<ProfileApproval />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="company-profile" element={<CompanyProfile />} />
        <Route path="departments" element={<Departments />} />
        <Route path="invitations" element={<Invitations />} />
        <Route path="settings" element={<GeneralSettings />} />
      </Route>
    </Routes>
  )
}
