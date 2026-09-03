import {
  LayoutDashboard,
  Building2,
  Users,
  Network,
  ShieldCheck,
  KeyRound,
  Send,
  CreditCard,
  CheckCircle2,
  BarChart3,
  FileText,
  Settings,
  Image,
  UserCheck,
  Bell
} from 'lucide-react';
import { PERMISSIONS } from './permissions';

export const ADMIN_NAV_SECTIONS = [
  {
    items: [
      {
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
        permission: PERMISSIONS.DASHBOARD_READ
      }
    ]
  },
  {
    title: 'ORGANIZATION',
    items: [
      {
        label: 'Company Profile',
        path: '/admin/company-profile',
        icon: Building2,
        permission: PERMISSIONS.COMPANY_PROFILE_READ
      },
      {
        label: 'Team Members',
        path: '/admin/team-members',
        icon: Users,
        permission: PERMISSIONS.TEAM_READ
      },
      {
        label: 'Departments',
        path: '/admin/departments',
        icon: Network,
        permission: PERMISSIONS.DEPARTMENT_READ
      },
      {
        label: 'Roles',
        path: '/admin/roles',
        icon: ShieldCheck,
        permission: PERMISSIONS.ROLE_READ
      },
      {
        label: 'Permissions',
        path: '/admin/permissions',
        icon: KeyRound,
        permission: PERMISSIONS.ROLE_READ
      },
      {
        label: 'Invitations',
        path: '/admin/invitations',
        icon: Send,
        permission: PERMISSIONS.INVITATION_READ
      },
      {
        label: 'Media Library',
        path: '/admin/media',
        icon: Image,
        permission: PERMISSIONS.MEDIA_READ
      }
    ]
  },
  {
    title: 'PROFILE',
    items: [
      {
        label: 'Employee Profiles',
        path: '/admin/employee-profiles',
        icon: UserCheck,
        permission: PERMISSIONS.TEAM_READ
      },
      {
        label: 'Templates',
        path: '/admin/templates',
        icon: CreditCard,
        permission: PERMISSIONS.TEMPLATE_READ
      },
      {
        label: 'Profile Approval',
        path: '/admin/profile-approvals',
        icon: CheckCircle2,
        permission: PERMISSIONS.PROFILE_APPROVAL_READ
      }
    ]
  },
  {
    title: 'ANALYTICS',
    items: [
      {
        label: 'Analytics',
        path: '/admin/analytics',
        icon: BarChart3,
        permission: PERMISSIONS.ANALYTICS_READ
      },
      {
        label: 'Audit Logs',
        path: '/admin/audit-logs',
        icon: FileText,
        permission: PERMISSIONS.AUDIT_LOG_READ
      }
    ]
  },
  {
    title: 'SETTINGS',
    items: [
      {
        label: 'Notifications',
        path: '/admin/notifications',
        icon: Bell
      },
      {
        label: 'General Settings',
        path: '/admin/settings',
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_READ
      }
    ]
  }
];
