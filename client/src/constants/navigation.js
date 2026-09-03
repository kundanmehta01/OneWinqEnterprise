import {
  LayoutDashboard,
  Building2,
  Users,
  Network,
  ShieldCheck,
  Send,
  CreditCard,
  CheckCircle2,
  BarChart3,
  FileText,
  Settings
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
        label: 'Roles & Permissions',
        path: '/admin/roles',
        icon: ShieldCheck,
        permission: PERMISSIONS.ROLE_READ
      },
      {
        label: 'Invitations',
        path: '/admin/invitations',
        icon: Send,
        permission: PERMISSIONS.INVITATION_READ
      }
    ]
  },
  {
    title: 'PROFILE',
    items: [
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
        label: 'General Settings',
        path: '/admin/settings',
        icon: Settings,
        permission: PERMISSIONS.SETTINGS_READ
      }
    ]
  }
];
