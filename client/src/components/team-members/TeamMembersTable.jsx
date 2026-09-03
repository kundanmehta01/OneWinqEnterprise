import React, { useState } from 'react';
import { MoreHorizontal, ArrowUpDown, ExternalLink, Edit2, Archive, CheckCircle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Dropdown } from '../common/Dropdown';
import { formatDate } from '../../utils/formatDate';

export const TeamMembersTable = ({
  members = [],
  loading = false,
  onEditMember,
  onArchiveMember,
  onViewProfile
}) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(members.map((m) => m._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getDepartmentBadgeVariant = (deptName = '') => {
    const lower = deptName.toLowerCase();
    if (lower.includes('market')) return 'purple';
    if (lower.includes('eng')) return 'blue';
    if (lower.includes('design')) return 'pink';
    if (lower.includes('human') || lower.includes('hr')) return 'amber';
    if (lower.includes('prod')) return 'green';
    return 'default';
  };

  const getStatusBadge = (status = '') => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="green" dot>Active</Badge>;
      case 'pending':
      case 'pending approval':
        return <Badge variant="amber" dot>Pending Approval</Badge>;
      case 'inactive':
      case 'suspended':
        return <Badge variant="red" dot>Inactive</Badge>;
      default:
        return <Badge variant="default" dot>{status || 'Unknown'}</Badge>;
    }
  };

  const sampleMembersFallback = [
    {
      _id: '1',
      name: 'Priya Sharma',
      email: 'priya.sharma@onewinq.com',
      designation: 'Marketing Manager',
      department: 'Marketing',
      role: 'Admin',
      status: 'active',
      completion: 100,
      joinedOn: '2024-05-12'
    },
    {
      _id: '2',
      name: 'Rahul Verma',
      email: 'rahul.verma@onewinq.com',
      designation: 'Senior Developer',
      department: 'Engineering',
      role: 'Member',
      status: 'active',
      completion: 85,
      joinedOn: '2024-04-28'
    },
    {
      _id: '3',
      name: 'Anjali Mehta',
      email: 'anjali.mehta@onewinq.com',
      designation: 'UI/UX Designer',
      department: 'Design',
      role: 'Member',
      status: 'active',
      completion: 90,
      joinedOn: '2024-04-20'
    },
    {
      _id: '4',
      name: 'Vikram Singh',
      email: 'vikram.singh@onewinq.com',
      designation: 'HR Executive',
      department: 'Human Resources',
      role: 'Member',
      status: 'active',
      completion: 75,
      joinedOn: '2024-04-18'
    },
    {
      _id: '5',
      name: 'Neha Patel',
      email: 'neha.patel@onewinq.com',
      designation: 'Content Writer',
      department: 'Marketing',
      role: 'Member',
      status: 'pending',
      completion: 60,
      joinedOn: '2024-05-20'
    },
    {
      _id: '6',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@onewinq.com',
      designation: 'Business Analyst',
      department: 'Engineering',
      role: 'Member',
      status: 'active',
      completion: 80,
      joinedOn: '2024-03-30'
    },
    {
      _id: '7',
      name: 'Sneha Joshi',
      email: 'sneha.joshi@onewinq.com',
      designation: 'Product Manager',
      department: 'Product',
      role: 'Admin',
      status: 'active',
      completion: 95,
      joinedOn: '2024-03-15'
    },
    {
      _id: '8',
      name: 'Karan Malhotra',
      email: 'karan.malhotra@onewinq.com',
      designation: 'DevOps Engineer',
      department: 'Engineering',
      role: 'Member',
      status: 'inactive',
      completion: 40,
      joinedOn: '2024-02-10'
    }
  ];

  const tableData =
    members.length > 0
      ? members.map((m) => ({
          _id: m._id,
          name: m.name,
          email: m.userId?.email || 'member@onewinq.com',
          designation: m.designation || 'Team Member',
          department: m.departmentId?.name || 'General',
          role: m.roleId?.name || (m.userId?.role === 'super_admin' ? 'Admin' : 'Member'),
          status: m.status || 'active',
          completion: m.profileCompletionScore || m.profileId?.completionPercentage || 75,
          joinedOn: m.joiningDate || m.createdAt,
          slug: m.profileId?.slug
        }))
      : sampleMembersFallback;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === tableData.length}
                  onChange={handleSelectAll}
                  className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-4">
                <span className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-600">
                  Member <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th className="py-3.5 px-4">
                <span className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-600">
                  Designation <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th className="py-3.5 px-4">
                <span className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-600">
                  Department <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th className="py-3.5 px-4">
                <span className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-600">
                  Role <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th className="py-3.5 px-4">
                <span className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-600">
                  Status <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th className="py-3.5 px-4">Profile Completion</th>
              <th className="py-3.5 px-4">Joined On</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {tableData.map((m) => {
              const isSelected = selectedIds.includes(m._id);
              const initial = m.name?.charAt(0).toUpperCase() || 'M';

              const menuItems = [
                {
                  label: 'Edit Details',
                  icon: Edit2,
                  onClick: () => onEditMember?.(m)
                },
                {
                  label: 'View Public Profile',
                  icon: ExternalLink,
                  onClick: () => {
                    if (m.slug) window.open(`/p/${m.slug}`, '_blank');
                    else onViewProfile?.(m);
                  }
                },
                { divider: true },
                {
                  label: 'Archive Member',
                  icon: Archive,
                  danger: true,
                  onClick: () => onArchiveMember?.(m._id)
                }
              ];

              return (
                <tr
                  key={m._id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isSelected ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(m._id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* Member Avatar + Name + Email */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                        {initial}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-snug">{m.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{m.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Designation */}
                  <td className="py-3.5 px-4 font-medium text-slate-700">{m.designation}</td>

                  {/* Department */}
                  <td className="py-3.5 px-4">
                    <Badge variant={getDepartmentBadgeVariant(m.department)}>
                      {m.department}
                    </Badge>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4">
                    <Badge variant={m.role === 'Admin' ? 'purple' : 'default'}>
                      {m.role}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">{getStatusBadge(m.status)}</td>

                  {/* Profile Completion Bar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3 min-w-[120px]">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${m.completion}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 min-w-[32px]">
                        {m.completion}%
                      </span>
                    </div>
                  </td>

                  {/* Joined On */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(m.joinedOn)}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-3.5 px-4 text-right">
                    <Dropdown
                      trigger={
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      }
                      items={menuItems}
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
