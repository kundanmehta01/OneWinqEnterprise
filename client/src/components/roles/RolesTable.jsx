import React from 'react';
import { Search, SlidersHorizontal, MoreHorizontal, ArrowUpDown, Shield, UserCheck, ShieldAlert, Edit2, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Dropdown } from '../common/Dropdown';

export const RolesTable = ({
  roles = [],
  selectedRole,
  onSelectRole,
  search = '',
  onSearchChange,
  onEditRole,
  onDeleteRole
}) => {
  const sampleFallbackRoles = [
    {
      _id: 'r1',
      name: 'Super Admin',
      description: 'Full access to all modules and settings',
      isSystem: true,
      usersCount: 2,
      isActive: true,
      permissions: ['*']
    },
    {
      _id: 'r2',
      name: 'HR Admin',
      description: 'Manage people, departments and approvals',
      isSystem: false,
      usersCount: 5,
      isActive: true,
      permissions: [
        'team.read', 'team.create', 'team.update', 'team.delete',
        'department.read', 'department.create', 'department.update', 'department.delete',
        'profile_approval.read', 'profile_approval.approve', 'profile_approval.reject',
        'invitation.read', 'invitation.create', 'invitation.resend', 'invitation.cancel'
      ]
    },
    {
      _id: 'r3',
      name: 'Content Admin',
      description: 'Manage content, templates and company profile',
      isSystem: false,
      usersCount: 3,
      isActive: true,
      permissions: [
        'company_profile.read', 'company_profile.update',
        'template.read', 'template.create', 'template.update', 'template.delete',
        'media.read', 'media.upload', 'media.delete'
      ]
    },
    {
      _id: 'r4',
      name: 'Team Lead',
      description: 'Limited access to team and member profiles',
      isSystem: false,
      usersCount: 8,
      isActive: true,
      permissions: ['team.read', 'department.read', 'template.read']
    },
    {
      _id: 'r5',
      name: 'Viewer',
      description: 'View-only access to members and profiles',
      isSystem: true,
      usersCount: 12,
      isActive: true,
      permissions: ['team.read', 'department.read', 'template.read', 'company_profile.read']
    },
    {
      _id: 'r6',
      name: 'Guest',
      description: 'Minimal access, restricted features',
      isSystem: true,
      usersCount: 0,
      isActive: false,
      permissions: []
    }
  ];

  const tableData = roles.map((r) => ({
          _id: r._id,
          name: r.name,
          description: r.description || 'Organization access role',
          isSystem: r.isSystem ?? (r.name === 'Super Admin' || r.name === 'Employee'),
          usersCount: r.usersCount ?? (r.name === 'Super Admin' ? 2 : r.name === 'HR Admin' ? 5 : 4),
          isActive: r.isActive ?? true,
          permissions: r.permissions || []
        }));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Roles</h3>
          <p className="text-xs text-slate-400 mt-0.5">View and manage all roles in your organization.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search roles..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">
                <span className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-600">
                  Role Name <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Users</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {tableData.map((role) => {
              const isSelected = selectedRole?._id === role._id;

              const actionItems = [
                {
                  label: 'Edit Role',
                  icon: Edit2,
                  onClick: () => onEditRole?.(role)
                },
                ...(!role.isSystem
                  ? [
                      { divider: true },
                      {
                        label: 'Delete Role',
                        icon: Trash2,
                        danger: true,
                        onClick: () => onDeleteRole?.(role._id)
                      }
                    ]
                  : [])
              ];

              return (
                <tr
                  key={role._id}
                  onClick={() => onSelectRole(role)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Name + Icon + Description */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-snug">{role.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4">
                    <Badge variant={role.isSystem ? 'purple' : 'green'}>
                      {role.isSystem ? 'System' : 'Custom'}
                    </Badge>
                  </td>

                  {/* Users */}
                  <td className="py-3.5 px-4 font-bold text-slate-700">{role.usersCount}</td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <Badge variant={role.isActive ? 'green' : 'red'} dot>
                      {role.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      trigger={
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      }
                      items={actionItems}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
