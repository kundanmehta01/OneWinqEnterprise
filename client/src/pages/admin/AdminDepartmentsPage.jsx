import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FolderTree,
  Users,
  UserCheck,
  Building2,
  Search,
  Plus,
  MoreHorizontal,
  X,
  Trash2,
  Edit2,
  Loader2,
  AlertCircle,
  Check,
  Shield
} from 'lucide-react';
import { departmentApi } from '../../api/departmentApi';
import { teamApi } from '../../api/teamApi';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusBadge } from '../../components/common/BadgePill';

export const AdminDepartmentsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headMemberId: ''
  });

  const { data: deptResponse, isLoading } = useQuery({
    queryKey: ['admin-departments'],
    queryFn: async () => {
      const res = await departmentApi.getAll();
      return Array.isArray(res) ? res : res?.data || [];
    }
  });

  const { data: teamResponse } = useQuery({
    queryKey: ['admin-team-heads-list'],
    queryFn: async () => {
      const res = await teamApi.getAll({ limit: 200 });
      // teamApi returns res.data which is { members, pagination } from backend
      // Handle all possible shapes
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.members)) return res.members;
      if (Array.isArray(res?.data?.members)) return res.data.members;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    }
  });

  const departmentsList = Array.isArray(deptResponse)
    ? deptResponse
    : Array.isArray(deptResponse?.data)
    ? deptResponse.data
    : [];
  // teamMembers used only for head lookup — member counts come from backend
  const teamMembers = Array.isArray(teamResponse) ? teamResponse : [];

  const createMutation = useMutation({
    mutationFn: async (data) => {
      setErrorMessage('');
      const payload = {
        name: data.name.trim(),
        description: data.description ? data.description.trim() : '',
        headMemberId: data.headMemberId ? data.headMemberId : null
      };
      return await departmentApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-departments'] });
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', headMemberId: '' });
      setSuccessToast('Department created successfully!');
      setTimeout(() => setSuccessToast(''), 3000);
    },
    onError: (err) => {
      setErrorMessage(err?.message || 'Failed to create department. Please check name and inputs.');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      setErrorMessage('');
      const payload = {
        name: data.name.trim(),
        description: data.description !== undefined ? data.description.trim() : '',
        headMemberId: data.headMemberId ? data.headMemberId : null
      };
      return await departmentApi.update(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-departments'] });
      setEditingDept(null);
      setSuccessToast('Department updated successfully!');
      setTimeout(() => setSuccessToast(''), 3000);
    },
    onError: (err) => {
      setErrorMessage(err?.message || 'Failed to update department.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await departmentApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-departments'] });
      setActiveMenuId(null);
      setSuccessToast('Department deleted successfully.');
      setTimeout(() => setSuccessToast(''), 3000);
    },
    onError: (err) => {
      alert(err?.message || 'Failed to delete department. Reassign active members first.');
      setActiveMenuId(null);
    }
  });

  const handleOpenEdit = (dept) => {
    setActiveMenuId(null);
    setErrorMessage('');
    const headId = dept.headMemberId?._id || dept.headMemberId || dept.headId?._id || dept.headId || '';
    setEditingDept({
      _id: dept._id,
      name: dept.name || '',
      description: dept.description || '',
      headMemberId: headId
    });
  };

  const filteredDepts = departmentsList
    .filter((d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'name_desc') return (b.name || '').localeCompare(a.name || '');
      return 0;
    });

  // Use memberCount from backend (set by aggregate in department.service.js)
  const totalMembers = departmentsList.reduce((sum, d) => sum + (d.memberCount || 0), 0);
  const totalDepts = departmentsList.length;
  const departmentHeadsCount = departmentsList.filter((d) => d.headMemberId || d.headId).length;
  const avgMembersPerDept = totalDepts > 0 ? (totalMembers / totalDepts).toFixed(1) : '0';

  const paletteColors = ['#9333ea', '#7c3aed', '#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  const deptDistribution = departmentsList.map((d, idx) => {
    // Use backend memberCount — no client-side filtering needed
    const count = d.memberCount || 0;
    const percentage = totalMembers > 0 ? ((count / totalMembers) * 100).toFixed(1) : '0';
    return {
      name: d.name,
      count,
      percentage: `${percentage}%`,
      color: paletteColors[idx % paletteColors.length]
    };
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* 1. Header & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display">
            Departments & Structure
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, structure, and assign leadership across your enterprise departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successToast && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold animate-fadeIn">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> {successToast}
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              setErrorMessage('');
              setFormData({ name: '', description: '', headMemberId: '' });
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Department</span>
          </button>
        </div>
      </div>

      {/* 2. 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Building2}
          iconBg="bg-purple-50 text-purple-600"
          title="Total Departments"
          value={totalDepts}
          trend=""
          trendType="neutral"
          trendLabel="Configured departments"
        />
        <KpiCard
          icon={Users}
          iconBg="bg-indigo-50 text-indigo-600"
          title="Total Members"
          value={totalMembers}
          trend=""
          trendType="neutral"
          trendLabel="Distributed team"
        />
        <KpiCard
          icon={UserCheck}
          iconBg="bg-amber-50 text-amber-600"
          title="Department Heads"
          value={departmentHeadsCount}
          trend=""
          trendType="neutral"
          trendLabel="Designated leaders"
        />
        <KpiCard
          icon={FolderTree}
          iconBg="bg-emerald-50 text-emerald-600"
          title="Avg. Team / Dept."
          value={avgMembersPerDept}
          trend=""
          trendType="neutral"
          trendLabel="Mean department size"
        />
      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Departments Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search departments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-purple-600"
              >
                <option value="name_asc">Sort: Name (A-Z)</option>
                <option value="name_desc">Sort: Name (Z-A)</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[260px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  <p className="text-xs text-slate-400 font-medium">Loading departments...</p>
                </div>
              ) : filteredDepts.length === 0 ? (
                <div className="text-center py-16">
                  <FolderTree className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No departments found</p>
                  <p className="text-xs text-slate-400 mt-1">Create your first department to organize members.</p>
                  <button
                    onClick={() => {
                      setErrorMessage('');
                      setIsCreateModalOpen(true);
                    }}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                  >
                    + Create Department
                  </button>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Department</th>
                      <th className="py-3 px-3">Department Head</th>
                      <th className="py-3 px-3">Members</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredDepts.map((d) => {
                      // Use backend memberCount directly
                      const deptMemberCount = d.memberCount || 0;
                      // headMemberId is populated by backend with { _id, name, designation, employeeId }
                      const headMember = d.headMemberId && typeof d.headMemberId === 'object'
                        ? d.headMemberId
                        : teamMembers.find((m) => m._id?.toString() === (d.headMemberId || d.headId)?.toString());

                      return (
                        <tr key={d._id} className="hover:bg-purple-50/30 transition-colors">
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 font-bold">
                                <FolderTree className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{d.name}</p>
                                <p className="text-[11px] text-slate-500 line-clamp-1">{d.description || 'Enterprise Division'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            {headMember ? (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-black shrink-0">
                                  {headMember.name?.slice(0, 2).toUpperCase() || 'DH'}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 text-xs">{headMember.name}</p>
                                  <p className="text-[10px] text-slate-400">{headMember.designation || 'Lead'}</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3">
                             <span className="font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                               {deptMemberCount}
                             </span>
                             <span className="text-[10px] text-slate-400 ml-1">staff</span>
                           </td>
                          <td className="py-3.5 px-3">
                            <StatusBadge status={d.isActive === false ? 'inactive' : 'active'} />
                          </td>
                          <td className="py-3.5 px-3 text-right relative">
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(activeMenuId === d._id ? null : d._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {activeMenuId === d._id && (
                              <div className="absolute right-3 mt-1 w-36 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-1.5 z-30 text-xs text-left animate-fadeIn">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(d)}
                                  className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-purple-50 text-slate-700 font-semibold cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-purple-600" /> Edit Dept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete '${d.name}'?`)) {
                                      deleteMutation.mutate(d._id);
                                    }
                                  }}
                                  className="w-full px-3.5 py-2 flex items-center gap-2 hover:bg-rose-50 text-rose-600 font-semibold border-t border-slate-100 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
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
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Showing {filteredDepts.length} of {departmentsList.length} departments</span>
          </div>
        </div>

        {/* Right: Dynamic Department Overview Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-purple-600" /> Department Distribution
            </h2>
            <p className="text-xs text-slate-500 mb-4">Real-time team distribution across active departments.</p>

            <div className="space-y-3.5 pt-2 text-xs">
              {deptDistribution.length === 0 ? (
                <p className="text-slate-400 text-center py-6">No departments created yet</p>
              ) : (
                deptDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-800 font-semibold text-xs truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="font-extrabold text-slate-900 text-xs shrink-0">
                        {item.count} ({item.percentage})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Create Department Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-purple-600" /> Create New Department
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(formData);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department Name <span className="text-purple-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & Labs"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Core responsibilities, scope, and objectives..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Head Leader (Optional)</label>
                <select
                  value={formData.headMemberId}
                  onChange={(e) => setFormData({ ...formData, headMemberId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900 text-xs"
                >
                  <option value="">None (Unassigned)</option>
                  {teamMembers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} — {m.designation || 'Member'}
                    </option>
                  ))}
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
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-200 cursor-pointer disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Edit Department Modal */}
      {editingDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-purple-600" /> Edit Department
              </h3>
              <button
                type="button"
                onClick={() => setEditingDept(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMutation.mutate({ id: editingDept._id, data: editingDept });
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department Name <span className="text-purple-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingDept.description}
                  onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department Head Leader</label>
                <select
                  value={editingDept.headMemberId || ''}
                  onChange={(e) => setEditingDept({ ...editingDept, headMemberId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900 text-xs"
                >
                  <option value="">None (Unassigned)</option>
                  {teamMembers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} — {m.designation || 'Member'}
                    </option>
                  ))}
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
                  onClick={() => setEditingDept(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-200 cursor-pointer disabled:opacity-50"
                >
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
