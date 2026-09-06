import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { publicProfileRoutes } from '../modules/public-profiles/publicProfile.routes.js';
import { invitationRoutes } from '../modules/invitations/invitation.routes.js';
import { employeeProfileRoutes } from '../modules/employee-profile/employeeProfile.routes.js';
import { teamMemberRoutes } from '../modules/team-members/teamMember.routes.js';
import { departmentRoutes } from '../modules/departments/department.routes.js';
import { roleRoutes } from '../modules/roles/role.routes.js';
import { permissionRoutes } from '../modules/permissions/permission.routes.js';
import { templateRoutes } from '../modules/templates/template.routes.js';
import { companyProfileRoutes } from '../modules/company-profile/companyProfile.routes.js';
import { profileApprovalRoutes } from '../modules/profile-approvals/profileApproval.routes.js';
import { analyticsRoutes } from '../modules/analytics/analytics.routes.js';
import { auditLogRoutes } from '../modules/audit-logs/auditLog.routes.js';
import { notificationRoutes } from '../modules/notifications/notification.routes.js';
import { settingsRoutes } from '../modules/settings/settings.routes.js';
import { dashboardRoutes } from '../modules/dashboard/dashboard.routes.js';
import { mediaRoutes } from '../modules/media/media.routes.js';
import { userDashboardRoutes } from '../modules/user-dashboard/userDashboard.routes.js';
import { userSettingsRoutes } from '../modules/user-settings/userSettings.routes.js';
import { connectionRoutes } from '../modules/connections/connection.routes.js';
import { eventRoutes } from '../modules/events/event.routes.js';
import { adminEventRoutes } from '../modules/events/adminEvent.routes.js';
import { userDirectoryRoutes } from '../modules/user-directory/userDirectory.routes.js';
import { supportRoutes } from '../modules/support/support.routes.js';

const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'OneWinq Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 1. Authentication & Session Gateway
apiRouter.use('/auth', authRoutes);

// 2. Public Gateway (for anonymous visitors, QR scans, company/employee public profiles)
apiRouter.use('/public', publicProfileRoutes);

// 3. Invitations Gateway (both public verify/accept and authenticated admin management)
apiRouter.use('/invitations', invitationRoutes);

// 4. Employee Experience (/me)
apiRouter.use('/me/home', userDashboardRoutes);
apiRouter.use('/me/dashboard', userDashboardRoutes);
apiRouter.use('/me/profile', employeeProfileRoutes);
apiRouter.use('/me/settings', userSettingsRoutes);
apiRouter.use('/me/notifications', notificationRoutes);

// 5. Professional Networking & Connections (/network)
apiRouter.use('/network', connectionRoutes);

// 6. Enterprise Events (/events)
apiRouter.use('/events', eventRoutes);

// 7. Organization Explorer for Employees (/user)
apiRouter.use('/user', userDirectoryRoutes);

// 8. Helpdesk & Support (/support)
apiRouter.use('/support', supportRoutes);

// 9. Admin / Management Experience (/admin)
apiRouter.use('/admin/dashboard', dashboardRoutes);
apiRouter.use('/admin/team', teamMemberRoutes);
apiRouter.use('/admin/departments', departmentRoutes);
apiRouter.use('/admin/roles', roleRoutes);
apiRouter.use('/admin/permissions', permissionRoutes);
apiRouter.use('/admin/invitations', invitationRoutes);
apiRouter.use('/admin/company-profile', companyProfileRoutes);
apiRouter.use('/admin/templates', templateRoutes);
apiRouter.use('/admin/approvals', profileApprovalRoutes);
apiRouter.use('/admin/events', adminEventRoutes);
apiRouter.use('/admin/analytics', analyticsRoutes);
apiRouter.use('/admin/audit-logs', auditLogRoutes);
apiRouter.use('/admin/settings', settingsRoutes);
apiRouter.use('/admin/media', mediaRoutes);

export const v1Routes = apiRouter;
