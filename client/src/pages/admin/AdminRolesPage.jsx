import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Shield,
  ShieldCheck,
  UserX,
  Search,
  Plus,
  Check,
  X,
  Save,
  Users,
  Loader2,
  Trash2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { roleApi } from '../../api/roleApi';
import { KpiCard } from '../../components/common/KpiCard';
import { RoleBadge, StatusBadge } from '../../components/common/BadgePill';

export const AdminRolesPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [activePermissions, setActivePermissions] = useState(new Set());
  const [createRoleForm, setCreateRoleForm] = useState({ name: '', description: '' });

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Query Roles (Dynamic)
  const { data: rolesResponse, isLoading: isRolesLoading } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: async () => {
      const res = await roleApi.getAll({ includeInactive: true });
      return Array.isArray(res) ? res : res?.data || [];
    }
  });

  const rolesList = Array.isArray(rolesResponse) ? rolesResponse : rolesResponse?.data || [];

  // Sync selected role
  useEffect(() => {
    if (rolesList.length > 0 && (!selectedRoleId || !rolesList.some((r) => r._id === selectedRoleId))) {
      setSelectedRoleId(rolesList[0]._id);
    }
  }, [rolesList, selectedRoleId]);

  const selectedRole = rolesList.find((r) => r._id === selectedRoleId) || rolesList[0];

  // Sync permissions for selected role
  useEffect(() => {
    if (selectedRole?.permissions) {
      setActivePermissions(new Set(selectedRole.permissions));
    } else {
      setActivePermissions(new Set());
    }
  }, [selectedRole]);

  // Update Role Permissions Mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, permissions, isActive, name, description }) => {
      const payload = {};
      if (permissions !== undefined) payload.permissions = Array.from(permissions);
      if (isActive !== undefined) payload.isActive = isActive;
      if (name !== undefined) payload.name = name;
      if (description !== undefined) payload.description = description;
      return await roleApi.update(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      setSaveSuccess(true);
      showToast('success', 'Role configuration updated successfully!');
      setTimeout(() => setSaveSuccess(false), 2500);
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || err?.message || 'Failed to update role.');
    }
  });

  // Create Role Mutation
  const createRoleMutation = useMutation({
    mutationFn: async (data) => {
      return await roleApi.create({
        ...data,
        permissions: ['dashboard.read', 'department.read', 'event.read']
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      setIsCreateModalOpen(false);
      setCreateRoleForm({ name: '', description: '' });
      const newRole = res?.data || res;
      if (newRole?._id) setSelectedRoleId(newRole._id);
      showToast('success', 'Custom role created successfully!');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || err?.message || 'Failed to create role.');
    }
  });

  // Delete Role Mutation
  const deleteRoleMutation = useMutation({
    mutationFn: async (id) => {
      return await roleApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      showToast('success', 'Role deleted successfully.');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || err?.message || 'Failed to delete role.');
    }
  });

  // Modules and their permission actions
  const modules = [
    { key: 'dashboard', name: 'Dashboard', actions: ['read'] },
    { key: 'company_profile', name: 'Company Profile', actions: ['read', 'update'] },
    { key: 'team', name: 'Team Members', actions: ['read', 'create', 'update', 'delete'] },
    { key: 'department', name: 'Departments', actions: ['read', 'create', 'update', 'delete'] },
    { key: 'role', name: 'Roles & Permissions', actions: ['read', 'create', 'update', 'delete'] },
    { key: 'invitation', name: 'Invitations', actions: ['read', 'create', 'cancel', 'resend'] },
    { key: 'template', name: 'Templates', actions: ['read', 'create', 'update', 'delete'] },
    { key: 'profile_approval', name: 'Profile Approval', actions: ['read', 'approve', 'reject', 'request_changes'] },
    { key: 'event', name: 'Enterprise Events', actions: ['read', 'create', 'update', 'delete'] },
    { key: 'card', name: 'Smart Cards & NFC', actions: ['read', 'create', 'update', 'delete', 'link', 'unlink'] },
    { key: 'analytics', name: 'Analytics', actions: ['read'] },
    { key: 'settings', name: 'Settings', actions: ['read', 'update'] },
    { key: 'media', name: 'Media Upload', actions: ['upload'] }
  ];

  const togglePermission = (permCode) => {
    setActivePermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permCode)) next.delete(permCode);
      else next.add(permCode);
      return next;
    });
  };

  const toggleAllModulePermissions = (moduleObj) => {
    const allModuleCodes = moduleObj.actions.map((act) => `${moduleObj.key}.${act}`);
    const allActive = allModuleCodes.every((code) => activePermissions.has(code));

    setActivePermissions((prev) => {
      const next = new Set(prev);
      if (allActive) {
        allModuleCodes.forEach((c) => next.delete(c));
      } else {
        allModuleCodes.forEach((c) => next.add(c));
      }
      return next;
    });
  };

  const handleSave = () => {
    if (!selectedRole) return;
    updateRoleMutation.mutate({ id: selectedRole._id, permissions: activePermissions });
  };

  const activeRolesCount = rolesList.filter((r) => r.isActive !== false).length;
  const customRolesCount = rolesList.filter((r) => !r.isSystem).length;
  const inactiveRolesCount = rolesList.filter((r) => r.isActive === false).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Roles & Permissions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic Role-Based Access Control (RBAC) governing capabilities across enterprise members.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Role</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Dynamic KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Users}
          iconBg="bg-indigo-50 text-indigo-600"
          title="Total Roles"
          value={rolesList.length}
          trend="Configured"
          trendType="neutral"
          trendLabel="in database"
        />
        <KpiCard
          icon={ShieldCheck}
          iconBg="bg-emerald-50 text-emerald-600"
          title="Active Roles"
          value={activeRolesCount}
          trend="Operational"
          trendType="neutral"
          trendLabel="assignable"
        />
        <KpiCard
          icon={UserX}
          iconBg="bg-amber-50 text-amber-600"
          title="Inactive Roles"
          value={inactiveRolesCount}
          trend="Disabled"
          trendType="neutral"
          trendLabel="restricted"
        />
        <KpiCard
          icon={Shield}
          iconBg="bg-blue-50 text-blue-600"
          title="Custom Roles"
          value={customRolesCount}
          trend="Custom"
          trendType="neutral"
          trendLabel="organization-defined"
        />
      </div>

      {/* 3. Main Split View: Roles on Left, Permission Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Roles Table (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-display">Configured Roles</h2>
              <p className="text-[11px] text-slate-400">Select a role to inspect and modify permissions in MongoDB.</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            {/* Roles List */}
            <div className="divide-y divide-slate-50 min-h-[260px]">
              {isRolesLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <p className="text-xs text-slate-400">Loading roles from database...</p>
                </div>
              ) : rolesList.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400">No roles found</div>
              ) : (
                rolesList
                  .filter((r) => r.name?.toLowerCase().includes(search.toLowerCase()))
                  .map((r) => {
                    const isSelected = selectedRoleId === r._id;
                    return (
                      <div
                        key={r._id}
                        onClick={() => setSelectedRoleId(r._id)}
                        className={`py-3 px-3 rounded-2xl cursor-pointer transition-all flex items-start justify-between gap-2 ${
                          isSelected ? 'bg-indigo-50/70 border border-indigo-200/80 shadow-2xs' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Shield className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">{r.name}</p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{r.description || 'Custom role'}</p>
                            <span className="text-[10px] text-indigo-600 font-semibold mt-1 inline-block">
                              {r.permissions?.length || 0} permissions
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <RoleBadge type={r.isSystem ? 'System' : 'Custom'} />
                            <StatusBadge status={r.isActive === false ? 'inactive' : 'active'} text="" />
                          </div>
                          {!r.isSystem && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete role "${r.name}"?`)) {
                                  deleteRoleMutation.mutate(r._id);
                                }
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete custom role"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
            <span>Showing {rolesList.length} roles</span>
            <span className="text-[10px] text-indigo-600 font-semibold">Changes sync live to DB</span>
          </div>
        </div>

        {/* Right Column: Permission Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 font-display">Role Permissions Matrix</h2>
                <p className="text-[11px] text-slate-400">
                  Configure granular capabilities for <strong className="text-indigo-600 font-bold">{selectedRole?.name}</strong>
                </p>
              </div>

              {rolesList.length > 0 && (
                <div className="w-48">
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    {rolesList.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.name} {r.isSystem ? '(System)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Module</th>
                    <th className="py-2.5 px-2 text-center">Read / View</th>
                    <th className="py-2.5 px-2 text-center">Create</th>
                    <th className="py-2.5 px-2 text-center">Update / Edit</th>
                    <th className="py-2.5 px-2 text-center">Delete / Cancel</th>
                    <th className="py-2.5 px-2 text-center">Toggle All</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                  {modules.map((m) => {
                    const readCode = `${m.key}.read`;
                    const createCode = `${m.key}.create`;
                    const updateCode = m.key === 'profile_approval' ? `${m.key}.approve` : `${m.key}.update`;
                    const deleteCode = m.key === 'invitation' ? `${m.key}.cancel` : `${m.key}.delete`;

                    const hasRead = activePermissions.has(readCode);
                    const hasCreate = activePermissions.has(createCode);
                    const hasUpdate = activePermissions.has(updateCode);
                    const hasDelete = activePermissions.has(deleteCode);

                    return (
                      <tr key={m.key} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-800">
                          {m.name}
                        </td>

                        {/* Read / View */}
                        <td className="py-2.5 px-2 text-center">
                          {m.actions.includes('read') ? (
                            <button
                              type="button"
                              onClick={() => togglePermission(readCode)}
                              className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all mx-auto ${
                                hasRead
                                  ? 'bg-indigo-600 text-white shadow-2xs'
                                  : 'border border-slate-200 hover:border-indigo-300 text-transparent'
                              }`}
                            >
                              {hasRead && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* Create */}
                        <td className="py-2.5 px-2 text-center">
                          {m.actions.includes('create') ? (
                            <button
                              type="button"
                              onClick={() => togglePermission(createCode)}
                              className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all mx-auto ${
                                hasCreate
                                  ? 'bg-indigo-600 text-white shadow-2xs'
                                  : 'border border-slate-200 hover:border-indigo-300 text-transparent'
                              }`}
                            >
                              {hasCreate && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* Update / Edit */}
                        <td className="py-2.5 px-2 text-center">
                          {m.actions.includes('update') || m.actions.includes('approve') ? (
                            <button
                              type="button"
                              onClick={() => togglePermission(updateCode)}
                              className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all mx-auto ${
                                hasUpdate
                                  ? 'bg-indigo-600 text-white shadow-2xs'
                                  : 'border border-slate-200 hover:border-indigo-300 text-transparent'
                              }`}
                            >
                              {hasUpdate && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* Delete / Cancel */}
                        <td className="py-2.5 px-2 text-center">
                          {m.actions.includes('delete') || m.actions.includes('cancel') ? (
                            <button
                              type="button"
                              onClick={() => togglePermission(deleteCode)}
                              className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all mx-auto ${
                                hasDelete
                                  ? 'bg-indigo-600 text-white shadow-2xs'
                                  : 'border border-slate-200 hover:border-indigo-300 text-transparent'
                              }`}
                            >
                              {hasDelete && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* Toggle All */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => toggleAllModulePermissions(m)}
                            className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                          >
                            Toggle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              <strong className="text-slate-800">{selectedRole?.name || 'Role'}</strong> · {activePermissions.size} permissions enabled
            </span>
            <button
              onClick={handleSave}
              disabled={updateRoleMutation.isPending || !selectedRole}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved to Database!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{updateRoleMutation.isPending ? 'Saving...' : 'Save Permissions'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Create Role Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-display">Create Custom Role</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createRoleMutation.mutate(createRoleForm);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operations Coordinator"
                  value={createRoleForm.name}
                  onChange={(e) => setCreateRoleForm({ ...createRoleForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Role scope and responsibilities..."
                  value={createRoleForm.description}
                  onChange={(e) => setCreateRoleForm({ ...createRoleForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRoleMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20"
                >
                  {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRolesPage;
