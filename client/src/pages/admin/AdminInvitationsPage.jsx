import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Plus,
  Copy,
  Trash2,
  X,
  Mail,
  Users,
  Loader2,
  RefreshCw,
  ExternalLink,
  Shield,
  Building2,
  Sparkles
} from 'lucide-react';
import { invitationApi } from '../../api/invitationApi';
import { departmentApi } from '../../api/departmentApi';
import { roleApi } from '../../api/roleApi';
import { KpiCard } from '../../components/common/KpiCard';
import { DepartmentBadge, RoleBadge, StatusBadge } from '../../components/common/BadgePill';
import { Pagination } from '../../components/common/Pagination';

export const AdminInvitationsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [createdInviteInfo, setCreatedInviteInfo] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    roleId: '',
    departmentId: '',
    designation: 'Team Member'
  });

  const { data: invitationsResponse, isLoading } = useQuery({
    queryKey: ['admin-invitations', page, pageSize, search, statusFilter],
    queryFn: async () => {
      const params = { page, limit: pageSize };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (search) params.search = search;
      const res = await invitationApi.getAll(params);
      return res?.data || res;
    }
  });

  const { data: deptResponse } = useQuery({
    queryKey: ['admin-dept-list-inv'],
    queryFn: async () => {
      const res = await departmentApi.getAll();
      return Array.isArray(res) ? res : res?.data || [];
    }
  });

  const { data: rolesResponse } = useQuery({
    queryKey: ['admin-roles-list-inv'],
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

  const invitationsList = Array.isArray(invitationsResponse)
    ? invitationsResponse
    : Array.isArray(invitationsResponse?.invitations)
    ? invitationsResponse.invitations
    : Array.isArray(invitationsResponse?.data)
    ? invitationsResponse.data
    : [];

  const sendMutation = useMutation({
    mutationFn: async (formData) => {
      setErrorMessage('');
      const payload = {
        email: formData.email.trim(),
        name: formData.name ? formData.name.trim() : undefined,
        designation: formData.designation ? formData.designation.trim() : 'Team Member',
        roleId: formData.roleId ? formData.roleId : undefined,
        departmentId: formData.departmentId ? formData.departmentId : undefined
      };
      return await invitationApi.send(payload);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-invitations'] });
      const data = res?.data || res;
      setCreatedInviteInfo(data);
      setInviteForm({ name: '', email: '', roleId: '', departmentId: '', designation: 'Team Member' });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send invitation. Please verify the input fields.';
      setErrorMessage(msg);
    }
  });

  const revokeMutation = useMutation({
    mutationFn: async (id) => {
      return await invitationApi.revoke(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invitations'] });
      setSuccessToast('Invitation revoked successfully.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  });

  const resendMutation = useMutation({
    mutationFn: async (id) => {
      return await invitationApi.resend(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-invitations'] });
      setSuccessToast('Invitation resent successfully.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  });

  const handleCopyLink = (id, tokenOrLink) => {
    let inviteUrl = '';
    if (tokenOrLink && tokenOrLink.startsWith('http')) {
      inviteUrl = tokenOrLink;
    } else if (tokenOrLink) {
      inviteUrl = `${window.location.origin}/invite/${tokenOrLink}`;
    } else {
      inviteUrl = `${window.location.origin}/invite/${id}`;
    }
    navigator.clipboard.writeText(inviteUrl);
    setCopiedId(id || 'created');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const pendingCount = invitationsList.filter((i) => i.status === 'pending').length;
  const acceptedCount = invitationsList.filter((i) => i.status === 'accepted').length;
  const expiredCount = invitationsList.filter((i) => i.status === 'expired').length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Team Member Invitations</h1>
          <p className="text-xs text-slate-500 mt-1">
            Invite and onboard enterprise employees into your organization with designated roles and permissions.
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedInviteInfo(null);
            setErrorMessage('');
            setIsInviteModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200 transition-all hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Send}
          iconBg="bg-purple-50 text-purple-600"
          title="Total Invitations"
          value={invitationsList.length}
          trend=""
          trendType="neutral"
          trendLabel="All recorded invites"
        />
        <KpiCard
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
          title="Accepted & Joined"
          value={acceptedCount}
          trend=""
          trendType="neutral"
          trendLabel="Active team members"
        />
        <KpiCard
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
          title="Pending Onboarding"
          value={pendingCount}
          trend=""
          trendType="neutral"
          trendLabel="Awaiting registration"
        />
        <KpiCard
          icon={AlertCircle}
          iconBg="bg-rose-50 text-rose-600"
          title="Expired / Inactive"
          value={expiredCount}
          trend=""
          trendType="neutral"
          trendLabel="Overdue invitations"
        />
      </div>

      {/* 3. Toolbar & Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by email, name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto min-h-[220px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Loader2 className="w-7 h-7 animate-spin text-purple-600" />
              <p className="text-xs text-slate-500 font-semibold">Loading invitations...</p>
            </div>
          ) : invitationsList.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">No member invitations found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click "Invite Team Member" above to send an onboarding link to a new employee.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Recipient Employee</th>
                  <th className="py-3 px-3">Designation</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Sent Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                {invitationsList.map((inv) => (
                  <tr key={inv._id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-bold text-slate-900 block">{inv.email}</span>
                        {inv.name && <span className="text-[11px] text-slate-400">{inv.name}</span>}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">{inv.designation || 'Team Member'}</td>
                    <td className="py-3.5 px-3">
                      <DepartmentBadge name={inv.departmentId?.name || inv.department?.name || 'General'} />
                    </td>
                    <td className="py-3.5 px-3">
                      <RoleBadge role={inv.roleId?.name || inv.role?.name || 'Member'} />
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 text-[11px]">{formatDate(inv.createdAt)}</td>
                    <td className="py-3.5 px-3">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleCopyLink(inv._id, inv.token || inv.inviteLink)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 text-[11px] font-semibold transition-colors shadow-2xs"
                              title="Copy Direct Join Link"
                            >
                              <Copy className="w-3 h-3 text-purple-600" />
                              <span>{copiedId === inv._id ? 'Copied!' : 'Copy Link'}</span>
                            </button>

                            <button
                              onClick={() => resendMutation.mutate(inv._id)}
                              disabled={resendMutation.isPending}
                              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
                              title="Resend Email Invitation"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Revoke invitation for ${inv.email}?`)) {
                                  revokeMutation.mutate(inv._id);
                                }
                              }}
                              disabled={revokeMutation.isPending}
                              className="p-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="Revoke Invitation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        {inv.status === 'accepted' && (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Active Member
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 4. Send Invitation & Success Dialog Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 w-full max-w-lg overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {createdInviteInfo ? 'Invitation Created!' : 'Invite Team Member'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setCreatedInviteInfo(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-State: Created Success Banner with 1-Click Copy Link */}
            {createdInviteInfo ? (
              <div className="p-6 space-y-5 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Invitation Successfully Generated!</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    An email has been prepared for <strong className="font-semibold">{createdInviteInfo.email}</strong>.
                    You can also share the direct onboarding link below:
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">Direct Member Onboarding Link</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={createdInviteInfo.inviteLink || `${window.location.origin}/invite/${createdInviteInfo.token || createdInviteInfo._id}`}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-purple-900 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyLink('created', createdInviteInfo.inviteLink || createdInviteInfo.token)}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-purple-200 shrink-0 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copiedId === 'created' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsInviteModalOpen(false);
                      setCreatedInviteInfo(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Sub-State: Invitation Form */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMutation.mutate(inviteForm);
                }}
                className="p-6 space-y-4 text-xs"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Employee Corporate Email <span className="text-purple-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="employee@company.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Software Architect"
                    value={inviteForm.designation}
                    onChange={(e) => setInviteForm({ ...inviteForm, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 focus:bg-white text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department</label>
                    <select
                      value={inviteForm.departmentId}
                      onChange={(e) => setInviteForm({ ...inviteForm, departmentId: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900"
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
                    <label className="block font-semibold text-slate-700 mb-1">Assigned Role</label>
                    <select
                      value={inviteForm.roleId}
                      onChange={(e) => setInviteForm({ ...inviteForm, roleId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-600 text-slate-900"
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
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendMutation.isPending}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-200 flex items-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {sendMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Invitation...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Invitation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
