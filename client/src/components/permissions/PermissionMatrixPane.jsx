import React from 'react';
import {
  Check,
  Minus,
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
  Settings,
  ChevronDown
} from 'lucide-react';

export const PermissionMatrixPane = ({
  roles = [],
  selectedRole,
  onSelectRoleId
}) => {
  const role = selectedRole || roles[0] || {
    name: 'HR Admin',
    permissions: ['team.read', 'team.create', 'team.update', 'team.delete', 'department.read', 'department.create', 'department.update', 'department.delete', 'profile_approval.read', 'profile_approval.approve', 'invitation.read', 'invitation.create', 'invitation.resend', 'invitation.cancel']
  };

  const isSuperAdmin = role.name === 'Super Admin' || role.permissions?.includes('*');

  const modules = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      actions: {
        view: isSuperAdmin || role.permissions?.includes('dashboard.read'),
        create: null,
        edit: null,
        delete: null,
        manage: null
      }
    },
    {
      name: 'Company Profile',
      icon: Building2,
      actions: {
        view: isSuperAdmin || role.permissions?.includes('company_profile.read'),
        create: isSuperAdmin,
        edit: isSuperAdmin || role.permissions?.includes('company_profile.update'),
        delete: null,
        manage: isSuperAdmin
      }
    },
    {
      name: 'Team Members',
      icon: Users,
      actions: {
        view: isSuperAdmin || role.permissions?.includes('team.read'),
        create: isSuperAdmin || role.permissions?.includes('team.create'),
        edit: isSuperAdmin || role.permissions?.includes('team.update'),
        delete: isSuperAdmin || role.permissions?.includes('team.delete'),
        manage: isSuperAdmin || (role.permissions?.includes('team.create') && role.permissions?.includes('team.delete'))
      }
    },
    {
      name: 'Departments',
      icon: Network,
      actions: {
        view: isSuperAdmin || role.permissions?.includes('department.read'),
        create: isSuperAdmin || role.permissions?.includes('department.create'),
        edit: isSuperAdmin || role.permissions?.includes('department.update'),
        delete: isSuperAdmin || role.permissions?.includes('department.delete'),
        manage: isSuperAdmin || (role.permissions?.includes('department.create') && role.permissions?.includes('department.delete'))
      }
    },
    {
      name: 'Roles & Permissions',
      icon: ShieldCheck,
      actions: {
        view: isSuperAdmin || role.permissions?.includes('role.read'),
        create: isSuperAdmin || role.permissions?.includes('role.create'),
        edit: isSuperAdmin || role.permissions?.includes('role.update'),
        delete: isSuperAdmin || role.permissions?.includes('role.delete'),
        manage: isSuperAdmin
      }
    },
    {
      name: 'Invitations',
      icon: Send,
      actions: {
        view: isSuperAdmin || role.permissions?.includes('invitation.read'),
        create: isSuperAdmin || role.permissions?.includes('invitation.create'),
        edit: null,
        delete: isSuperAdmin || role.permissions?.includes('invitation.cancel'),
        manage: isSuperAdmin || role.permissions?.includes('invitation.create')
      }
    },
    {
      name: 'Templates',
      icon: CreditCard,
      actions: {
        view: isSuperAdmin || role.permissions?.includes('template.read'),
        create: isSuperAdmin || role.permissions?.includes('template.create'),
        edit: isSuperAdmin || role.permissions?.includes('template.update'),
        delete: isSuperAdmin || role.permissions?.includes('template.delete'),
        manage: isSuperAdmin
      }
    },
    {
      name: 'Profile Approval',
      icon: CheckCircle2,
      actions: {
        view: isSuperAdmin || role.permissions?.includes('profile_approval.read'),
        create: null,
        edit: null,
        delete: null,
        manage: isSuperAdmin || role.permissions?.includes('profile_approval.approve')
      }
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      actions: {
        view: isSuperAdmin || role.permissions?.includes('analytics.read'),
        create: null,
        edit: null,
        delete: null,
        manage: null
      }
    },
    {
      name: 'Audit Logs',
      icon: FileText,
      actions: {
        view: isSuperAdmin || role.permissions?.includes('audit_log.read'),
        create: null,
        edit: null,
        delete: null,
        manage: null
      }
    },
    {
      name: 'Settings',
      icon: Settings,
      actions: {
        view: isSuperAdmin || role.permissions?.includes('settings.read'),
        create: null,
        edit: isSuperAdmin || role.permissions?.includes('settings.update'),
        delete: null,
        manage: isSuperAdmin
      }
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
      <div className="mb-6">
        <h3 className="text-base font-bold text-slate-900">Permission Details</h3>

        {/* Role Selector Dropdown */}
        <div className="mt-3">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Select Role
          </label>
          <div className="relative">
            <select
              value={role._id}
              onChange={(e) => onSelectRoleId?.(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-300 transition cursor-pointer shadow-2xs"
            >
              {roles.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Module Permissions
        </h4>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse min-w-[420px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-6">Module</th>
                <th className="py-2.5 px-3 text-center">View</th>
                <th className="py-2.5 px-3 text-center">Create</th>
                <th className="py-2.5 px-3 text-center">Edit</th>
                <th className="py-2.5 px-3 text-center">Delete</th>
                <th className="py-2.5 px-3 text-center">Manage</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {modules.map((mod) => {
                const Icon = mod.icon;

                const renderCell = (isAllowed) => {
                  if (isAllowed === null) {
                    return <span className="text-slate-300 font-bold">—</span>;
                  }
                  if (isAllowed) {
                    return (
                      <div className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-indigo-600 text-white shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    );
                  }
                  return <span className="text-slate-300 font-bold">—</span>;
                };

                return (
                  <tr key={mod.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-6 font-semibold text-slate-800 flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{mod.name}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">{renderCell(mod.actions.view)}</td>
                    <td className="py-2.5 px-3 text-center">{renderCell(mod.actions.create)}</td>
                    <td className="py-2.5 px-3 text-center">{renderCell(mod.actions.edit)}</td>
                    <td className="py-2.5 px-3 text-center">{renderCell(mod.actions.delete)}</td>
                    <td className="py-2.5 px-3 text-center">{renderCell(mod.actions.manage)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
