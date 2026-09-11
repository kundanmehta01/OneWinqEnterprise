import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  FolderTree,
  Mail,
  Shield,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Plus,
  Send,
  X,
  Trash2,
  Edit2,
  ExternalLink,
  Loader2,
  AlertCircle,
  Check,
  UserCog
} from 'lucide-react';
import { teamApi } from '../../api/teamApi';
import { departmentApi } from '../../api/departmentApi';
import { roleApi } from '../../api/roleApi';
import { KpiCard } from '../../components/common/KpiCard';
import { DepartmentBadge, RoleBadge, StatusBadge } from '../../components/common/BadgePill';
import { Pagination } from '../../components/common/Pagination';

export const AdminTeamPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Form State for Add Member
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    designation: '',
    departmentId: '',
    roleId: ''
  });

  // Query Team Members (Dynamic)
  const { data: teamResponse, isLoading: isTeamLoading } = useQuery({
    queryKey: ['admin-team-members', page, pageSize, search, selectedDept, selectedRole, selectedStatus],
    queryFn: async () => {
      const params = { page, limit: pageSize };
      if (search) params.search = search;
      if (selectedDept !== 'ALL') params.departmentId = selectedDept;
      if (selectedRole !== 'ALL') params.roleId = selectedRole;
      if (selectedStatus !== 'ALL') params.status = selectedStatus;
      const res = await teamApi.getAll(params);
      return res;
    }
  });

  // Query Departments
  const { data: deptResponse } = useQuery({
    queryKey: ['admin-departments-list'],
    queryFn: async () => {
      const res = await departmentApi.getAll();
      return Array.isArray(res) ? res : res?.data || [];
    }
  });

  // Query Roles
  const { data: rolesResponse } = useQuery({
    queryKey: ['admin-roles-list'],
    queryFn: async () => {
      const res = await roleApi.getAll();
      return Array.isArray(res) ? res : res?.data || [];
    }
  });

  const departments = Array.isArray(deptResponse)
    ? deptResponse
    : Array.isArray(deptResponse?.data)
    ? deptResponse.data
    : [];
  const roles = Array.isArray(rolesResponse)
    ? rolesResponse
    : Array.isArray(rolesResponse?.data)
    ? rolesResponse.data
    : [];

  // Extract members list & pagination safely
  const membersList = Array.isArray(teamResponse?.data)
    ? teamResponse.data
    : Array.isArray(teamResponse?.members)
    ? teamResponse.members
    : Array.isArray(teamResponse?.data?.members)
    ? teamResponse.data.members
    : Array.isArray(teamResponse)
    ? teamResponse
    : [];
  const pagination = teamResponse?.pagination || {
    totalItems: membersList.length,
    totalPages: Math.ceil(membersList.length / pageSize) || 1,
    currentPage: page
  };

  const getRoleDefaultDesignation = (roleName) => {
    if (!roleName) return 'Team Member';
    const r = roleName.toLowerCase();
    if (r.includes('hr') || r.includes('people') || r.includes('talent')) return 'HR Administrator';
    if (r.includes('super') || r.includes('founder') || r.includes('executive')) return 'Executive Director';
    if (r.includes('content')) return 'Content Administrator';
    if (r === 'admin') return 'System Administrator';
    if (r.includes('sales') || r.includes('bd')) return 'Enterprise Account Executive';
    if (r.includes('engineering') || r.includes('dev')) return 'Software Engineer';
    return 'Team Member';
  };

  // Add Member Mutation
  const addMemberMutation = useMutation({
    mutationFn: async (payload) => {
      setErrorMessage('');
      const targetRole = roles.find((r) => r._id === payload.roleId) || roles.find((r) => r.name !== 'Super Admin') || roles[0];
      const fallbackDesig = getRoleDefaultDesignation(targetRole?.name);
      const cleanPayload = {
        name: payload.name.trim(),
        email: payload.email.trim(),
        employeeId: payload.employeeId ? payload.employeeId.trim() : undefined,
        designation: payload.designation && payload.designation.trim() !== 'Team Member' ? payload.designation.trim() : fallbackDesig,
        departmentId: payload.departmentId ? payload.departmentId : undefined,
        roleId: payload.roleId ? payload.roleId : targetRole?._id
      };
      return await teamApi.create(cleanPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', employeeId: '', designation: '', departmentId: '', roleId: '' });
      setSuccessToast('Team member added successfully!');
      setTimeout(() => setSuccessToast(''), 3000);
    },
    onError: (err) => {
      setErrorMessage(err?.message || 'Failed to add member. Please verify email and employee ID.');
    }
  });

  // Update Member & Assign Role Mutation
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      setErrorMessage('');
      const cleanData = {
        name: data.name.trim(),
        employeeId: data.employeeId ? data.employeeId.trim() : undefined,
        designation: data.designation ? data.designation.trim() : undefined,
        departmentId: data.departmentId ? data.departmentId : null,
        roleId: data.roleId ? data.roleId : undefined,
        status: data.status || 'active'
      };
      return await teamApi.update(id, cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      setEditingMember(null);
      setSuccessToast('Member updated and role assigned successfully!');
      setTimeout(() => setSuccessToast(''), 3000);
    },
    onError: (err) => {
      setErrorMessage(err?.message || 'Failed to update member or assign role.');
    }
  });

  // Delete Member Mutation
  const deleteMemberMutation = useMutation({
    mutationFn: async (id) => {
      return await teamApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      setActiveMenuId(null);
      setSuccessToast('Member removed from team.');
      setTimeout(() => setSuccessToast(''), 3000);
    },
    onError: (err) => {
      alert(err?.message || 'Failed to remove member.');
      setActiveMenuId(null);
    }
  });

  const handleOpenEdit = (m) => {
    setActiveMenuId(null);
    setErrorMessage('');
    const deptId = m.departmentId?._id || m.departmentId || '';
    const roleId = m.roleId?._id || m.roleId || '';
    setEditingMember({
      _id: m._id,
      name: m.name || '',
      email: m.email || m.userId?.email || '',
      employeeId: m.employeeId || '',
      designation: m.designation || '',
      departmentId: deptId,
      roleId: roleId,
      status: m.status || 'active'
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMembers(membersList.map((m) => m._id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter((mId) => mId !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const activeCount = membersList.filter((m) => m.status === 'active').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
            Manage Users
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage organization members, departments, and assigned roles.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {successToast && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> {successToast}
            </span>
          )}

          <Link
            to="/admin/invitations"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-purple-600" />
            <span>Invite Members</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setErrorMessage('');
              setFormData({ name: '', email: '', employeeId: '', designation: '', departmentId: '', roleId: '' });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* 2. 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Users}
          iconBg="bg-purple-50 text-purple-600"
          title="Total Members"
          value={pagination.totalItems || membersList.length}
          trend=""
          trendType="neutral"
          trendLabel="Active team accounts"
        />
        <KpiCard
          icon={UserCheck}
          iconBg="bg-emerald-50 text-emerald-600"
          title="Active Status"
          value={activeCount}
          trend=""
          trendType="neutral"
          trendLabel="Operational members"
        />
        <KpiCard
          icon={FolderTree}
          iconBg="bg-indigo-50 text-indigo-600"
          title="Departments"
          value={departments.length}
          trend=""
          trendType="neutral"
          trendLabel="Configured units"
        />
        <KpiCard
          icon={Shield}
          iconBg="bg-amber-50 text-amber-600"
          title="Configured Roles"
          value={roles.length}
          trend=""
          trendType="neutral"
          trendLabel="Access privilege levels"
        />
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by member name, email, employee ID, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-600"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-600"
          >
            <option value="ALL">All Roles</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* 4. Team Members Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          {isTeamLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p className="text-xs text-slate-400 font-medium">Loading team members...</p>
            </div>
          ) : membersList.length === 0 ? (
            <div className="text-center py-20 px-4">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-800">No team members match the criteria</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Add new team members or send onboarding email invitations to expand your company directory.
              </p>
              <div className="flex items-center justify-center gap-3 mt-5">
                <Link
                  to="/admin/invitations"
                  className="px-4 py-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold"
                >
                  Send Invitations
                </Link>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-sm"
                >
                  + Add Member
                </button>
              </div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedMembers.length === membersList.length && membersList.length > 0}
                      className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4">Member Name & Email</th>
                  <th className="py-3.5 px-3">Emp. ID</th>
                  <th className="py-3.5 px-3">Designation</th>
                  <th className="py-3.5 px-3">Department</th>
                  <th className="py-3.5 px-3">Role</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {membersList.map((m) => {
                  const isSelected = selectedMembers.includes(m._id);
                  const deptName = m.departmentId?.name || (departments.find((d) => d._id === m.departmentId)?.name) || 'General';
                  const roleName = m.roleId?.name || (roles.find((r) => r._id === m.roleId)?.name) || 'Viewer';

                  return (
                    <tr
                      key={m._id}
                      className={`hover:bg-purple-50/30 transition-colors ${
                        isSelected ? 'bg-purple-50/50' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(m._id)}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-black text-xs shrink-0 overflow-hidden">
                            {m.avatarUrl ? (
                              <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                            ) : (
                              m.name?.slice(0, 2).toUpperCase() || 'EM'
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs sm:text-sm">{m.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{m.email || m.userId?.email || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-600">{m.employeeId || '-'}</td>
                      <td className="py-3.5 px-3 font-medium text-slate-800">{m.designation || 'Team Member'}</td>
                      <td className="py-3.5 px-3">
                        <DepartmentBadge department={deptName} />
                      </td>
                      <td className="py-3.5 px-3">
                        <RoleBadge role={roleName} />
                      </td>
                      <td className="py-3.5 px-3">
                        <StatusBadge status={m.status || 'active'} />
                      </td>
                      <td className="py-3.5 px-4 text-right relative">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(activeMenuId === m._id ? null : m._id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuId === m._id && (
                          <div className="absolute right-4 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-1.5 z-30 text-xs text-left animate-fadeIn">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(m)}
                              className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-purple-50 text-slate-700 font-semibold cursor-pointer"
                            >
                              <UserCog className="w-3.5 h-3.5 text-purple-600" /> Edit & Assign Role
                            </button>

                            {m.profileId?.slug && (
                              <button
                                type="button"
                                onClick={() => {
                                  window.open(`/p/${m.profileId.slug}`, '_blank');
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-purple-50 text-slate-700 font-semibold cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-slate-500" /> View Digital Card
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${m.name} from the team?`)) {
                                  deleteMemberMutation.mutate(m._id);
                                }
                              }}
                              className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-rose-50 text-rose-600 font-semibold border-t border-slate-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove Member
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 5. Pagination */}
        {membersList.length > 0 && (
          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pageSize}
              itemName="members"
              onPageChange={(p) => setPage(p)}
              onPageSizeChange={(sz) => {
                setPageSize(sz);
                setPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* 6. Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" /> Add Team Member
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMemberMutation.mutate(formData);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-purple-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Email <span className="text-purple-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john.doe@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    placeholder="EMP-020"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="Senior Product Designer"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900"
                  >
                    <option value="">General / None</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => {
                      const newRoleId = e.target.value;
                      const roleObj = roles.find((r) => r._id === newRoleId);
                      let autoDesig = formData.designation;
                      if (!autoDesig || autoDesig === 'Team Member' || ['HR Administrator', 'Executive Director', 'System Administrator', 'Content Administrator'].includes(autoDesig)) {
                        autoDesig = getRoleDefaultDesignation(roleObj?.name);
                      }
                      setFormData({ ...formData, roleId: newRoleId, designation: autoDesig });
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900"
                  >
                    <option value="">Default (Viewer / Member)</option>
                    {roles.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addMemberMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200 cursor-pointer disabled:opacity-50"
                >
                  {addMemberMutation.isPending ? 'Saving...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Edit Member & Assign Role Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCog className="w-4 h-4 text-purple-600" /> Edit Member & Assign Role
              </h3>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMemberMutation.mutate({ id: editingMember._id, data: editingMember });
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-purple-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={editingMember.employeeId}
                    onChange={(e) => setEditingMember({ ...editingMember, employeeId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={editingMember.designation}
                  onChange={(e) => setEditingMember({ ...editingMember, designation: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Department</label>
                  <select
                    value={editingMember.departmentId}
                    onChange={(e) => setEditingMember({ ...editingMember, departmentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900 text-xs"
                  >
                    <option value="">General / Unassigned</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Assign Role <span className="text-purple-600">*</span>
                  </label>
                  <select
                    value={editingMember.roleId}
                    onChange={(e) => {
                      const newRoleId = e.target.value;
                      const roleObj = roles.find((r) => r._id === newRoleId);
                      let autoDesig = editingMember.designation;
                      if (!autoDesig || autoDesig === 'Team Member' || ['HR Administrator', 'Executive Director', 'System Administrator', 'Content Administrator'].includes(autoDesig)) {
                        autoDesig = getRoleDefaultDesignation(roleObj?.name);
                      }
                      setEditingMember({ ...editingMember, roleId: newRoleId, designation: autoDesig });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900 text-xs font-semibold"
                  >
                    {roles.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name} {r.isSystem ? '(System)' : '(Custom)'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Status</label>
                <select
                  value={editingMember.status}
                  onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900 text-xs"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMemberMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-200 cursor-pointer disabled:opacity-50"
                >
                  {updateMemberMutation.isPending ? 'Saving...' : 'Save & Assign Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
