import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  SlidersHorizontal,
  Eye,
  X,
  Calendar,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { approvalApi } from '../../api/approvalApi';
import { KpiCard } from '../../components/common/KpiCard';
import { Pagination } from '../../components/common/Pagination';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

const renderFormattedDiffValue = (val, field = '', isOld = false) => {
  if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
    return <span className="text-slate-400 italic text-[11px]">None</span>;
  }

  let parsed = val;
  if (typeof val === 'string' && (val.trim().startsWith('[') || val.trim().startsWith('{'))) {
    try {
      parsed = JSON.parse(val);
    } catch (e) {}
  }

  // Handle Arrays
  if (Array.isArray(parsed)) {
    const fLower = (field || '').toLowerCase();

    // 1. Skills
    if (fLower.includes('skill')) {
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {parsed.map((item, i) => {
            const skillName = typeof item === 'object' ? item?.name : String(item);
            return (
              <span
                key={i}
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                  isOld
                    ? 'bg-rose-50 border-rose-200 text-rose-700 line-through'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                {skillName}
              </span>
            );
          })}
        </div>
      );
    }

    // 2. Experience
    if (fLower.includes('experience')) {
      return (
        <div className="space-y-1.5 mt-1 text-left">
          {parsed.map((item, i) => {
            if (typeof item !== 'object' || !item) return <div key={i}>{String(item)}</div>;
            const start = formatDate(item.startDate);
            const end = item.isCurrent ? 'Present' : formatDate(item.endDate);
            const dateRange = start ? `${start} – ${end || 'Present'}` : '';

            return (
              <div
                key={i}
                className={`p-2 rounded-xl border text-[11px] space-y-0.5 ${
                  isOld
                    ? 'bg-rose-50/50 border-rose-200/70 text-rose-900'
                    : 'bg-emerald-50/50 border-emerald-200/70 text-emerald-950'
                }`}
              >
                <div className="font-bold flex items-center justify-between gap-2">
                  <span className={isOld ? 'line-through text-rose-700' : 'text-slate-900'}>
                    {item.title || 'Role Title'}
                  </span>
                  {dateRange && <span className="text-[10px] text-slate-400 font-medium shrink-0">{dateRange}</span>}
                </div>
                <div className="text-[10px] text-slate-600 flex items-center gap-2">
                  {item.company && <span className="font-medium text-slate-700">{item.company}</span>}
                  {item.location && <span>• {item.location}</span>}
                </div>
                {item.description && (
                  <p className="text-[10px] text-slate-500 line-clamp-2 pt-0.5 italic">
                    "{item.description}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // 3. Projects
    if (fLower.includes('project')) {
      return (
        <div className="space-y-1.5 mt-1 text-left">
          {parsed.map((item, i) => {
            if (typeof item !== 'object' || !item) return <div key={i}>{String(item)}</div>;
            return (
              <div
                key={i}
                className={`p-2 rounded-xl border text-[11px] space-y-0.5 ${
                  isOld
                    ? 'bg-rose-50/50 border-rose-200/70 text-rose-900'
                    : 'bg-emerald-50/50 border-emerald-200/70 text-emerald-950'
                }`}
              >
                <div className="font-bold flex items-center justify-between gap-2">
                  <span className={isOld ? 'line-through text-rose-700' : 'text-slate-900'}>
                    {item.title || item.name || 'Project Name'}
                  </span>
                  {item.liveUrl && (
                    <span className="text-[10px] text-indigo-600 font-mono underline truncate max-w-[140px]">
                      {item.liveUrl}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-[10px] text-slate-500 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    // 4. Social Links
    if (fLower.includes('social') || fLower.includes('link')) {
      return (
        <div className="space-y-1 mt-1 text-left">
          {parsed.map((item, i) => {
            if (typeof item !== 'object' || !item) return <div key={i}>{String(item)}</div>;
            return (
              <div key={i} className="text-[11px] flex items-center gap-2 p-1.5 rounded-lg bg-white border border-slate-100">
                <span className="font-bold text-slate-700 capitalize text-[10px] min-w-[50px]">{item.platform || 'Link'}:</span>
                <span className={`text-[10px] font-mono truncate ${isOld ? 'line-through text-rose-600' : 'text-indigo-600'}`}>
                  {item.url}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    // Fallback Array of items:
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {parsed.map((item, i) => (
          <span key={i} className="text-[10px] text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
            {typeof item === 'object' ? (item.name || item.title || JSON.stringify(item)) : String(item)}
          </span>
        ))}
      </div>
    );
  }

  // Handle Object (not array)
  if (typeof parsed === 'object' && parsed !== null) {
    if (parsed.title || parsed.name) {
      return (
        <div className="text-[11px] font-medium text-slate-800">
          <span className={isOld ? 'line-through text-rose-600' : 'text-emerald-700'}>{parsed.title || parsed.name}</span>
          {parsed.company && <span className="text-slate-500 text-[10px] block">{parsed.company}</span>}
        </div>
      );
    }
  }

  // Primitive Text / Number / Boolean
  return (
    <span
      className={`text-[11px] block break-words leading-relaxed ${
        isOld ? 'text-rose-600 line-through' : 'text-emerald-800 font-medium'
      }`}
    >
      {String(parsed)}
    </span>
  );
};

export const AdminProfileApprovalPage = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
  const [search, setSearch] = useState('');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [actionMessage, setActionMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: approvalsResponse, isLoading } = useQuery({
    queryKey: ['admin-approvals', activeTab, page, pageSize, search],
    queryFn: async () => {
      const params = { page, limit: pageSize };
      if (activeTab !== 'all') params.status = activeTab;
      const res = await approvalApi.getAll(params);
      return res;
    }
  });

  const rawList = Array.isArray(approvalsResponse?.data)
    ? approvalsResponse.data
    : Array.isArray(approvalsResponse?.approvals)
    ? approvalsResponse.approvals
    : Array.isArray(approvalsResponse)
    ? approvalsResponse
    : [];

  const paginationMeta = approvalsResponse?.pagination || {
    page: 1,
    limit: 10,
    total: rawList.length,
    totalPages: 1
  };

  const filteredApprovals = rawList.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = item.memberId?.name || item.member?.name || '';
    const email = item.submittedBy?.email || item.member?.email || '';
    const designation = item.memberId?.designation || '';
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || designation.toLowerCase().includes(q);
  });

  const counts = approvalsResponse?.meta?.counts || {
    pending: rawList.filter((a) => a.status === 'pending').length,
    approved: rawList.filter((a) => a.status === 'approved').length,
    rejected: rawList.filter((a) => a.status === 'rejected').length,
    total: rawList.length
  };

  const pendingCount = counts.pending ?? 0;
  const approvedCount = counts.approved ?? 0;
  const rejectedCount = counts.rejected ?? 0;
  const totalCount = counts.total ?? rawList.length;

  const approvalMutation = useMutation({
    mutationFn: async ({ id, status, reviewNote }) => {
      const action = status === 'approved' ? 'approve' : status === 'rejected' ? 'reject' : status;
      return await approvalApi.review(id, { action, status, reviewNote });
    },
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin-approvals'] });
      setActionMessage(`Request successfully marked as ${vars.status}!`);
      setTimeout(() => setActionMessage(null), 3500);
      setSelectedApproval(null);
      setReviewNote('');
    },
    onError: (err) => {
      setActionMessage(`Error: ${err?.response?.data?.message || 'Failed to update approval request.'}`);
      setTimeout(() => setActionMessage(null), 4000);
    }
  });

  const currentApproval = selectedApproval || filteredApprovals[0] || null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? '-'
      : d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile Approval</h1>
          <p className="text-xs text-slate-500 mt-1">Review and approve or reject profile changes requested by members.</p>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* 2. 4 KPI Summary Cards (Dynamic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Clock}
          iconBg="bg-purple-50 text-purple-600"
          title="Pending Approvals"
          value={pendingCount}
          trend=""
          trendType="neutral"
          trendLabel="Awaiting admin action"
        />
        <KpiCard
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
          title="Approved"
          value={approvedCount}
          trend=""
          trendType="neutral"
          trendLabel="Approved profile updates"
        />
        <KpiCard
          icon={XCircle}
          iconBg="bg-rose-50 text-rose-600"
          title="Rejected"
          value={rejectedCount}
          trend=""
          trendType="neutral"
          trendLabel="Rejected submissions"
        />
        <KpiCard
          icon={Users}
          iconBg="bg-blue-50 text-blue-600"
          title="Total Requests"
          value={totalCount}
          trend=""
          trendType="neutral"
          trendLabel="Total recorded requests"
        />
      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Requests Table & Tabs */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            {/* Status Tabs and Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-4 text-xs font-semibold overflow-x-auto">
                <button
                  onClick={() => {
                    setActiveTab('pending');
                    setPage(1);
                  }}
                  className={`pb-1 relative transition-colors ${
                    activeTab === 'pending'
                      ? 'text-purple-600 border-b-2 border-purple-600 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('approved');
                    setPage(1);
                  }}
                  className={`pb-1 relative transition-colors ${
                    activeTab === 'approved'
                      ? 'text-purple-600 border-b-2 border-purple-600 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Approved ({approvedCount})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('rejected');
                    setPage(1);
                  }}
                  className={`pb-1 relative transition-colors ${
                    activeTab === 'rejected'
                      ? 'text-purple-600 border-b-2 border-purple-600 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Rejected ({rejectedCount})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setPage(1);
                  }}
                  className={`pb-1 relative transition-colors ${
                    activeTab === 'all'
                      ? 'text-purple-600 border-b-2 border-purple-600 font-bold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  All ({totalCount})
                </button>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter requests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 w-full sm:w-44"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[260px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  <p className="text-xs text-slate-400">Loading approval requests...</p>
                </div>
              ) : filteredApprovals.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-400">
                  No profile approval requests found in this view.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Member</th>
                      <th className="py-2.5 px-3">Requested On</th>
                      <th className="py-2.5 px-3">Changes</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                    {filteredApprovals.map((item) => {
                      const isSelected = currentApproval?._id === item._id;
                      const memberName = item.memberId?.name || item.member?.name || 'Team Member';
                      const memberEmail = item.submittedBy?.email || item.member?.email || '-';
                      const diffCount = item.diffSummary?.length || 0;
                      const avatarUrl = item.memberId?.avatarUrl || item.draftSnapshot?.avatarUrl;

                      return (
                        <tr
                          key={item._id}
                          onClick={() => setSelectedApproval(item)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-purple-50/60 font-medium' : 'hover:bg-slate-50/60'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt={memberName}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                                  {memberName.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-slate-900">{memberName}</p>
                                <p className="text-[10px] text-slate-400">{memberEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                            {formatDate(item.submittedAt || item.createdAt)}
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[11px] text-slate-600 font-semibold">{diffCount} field(s)</span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                item.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : item.status === 'rejected'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-100'
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedApproval(item);
                              }}
                              className="p-1 text-slate-400 hover:text-purple-600 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
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
            <span>Showing {filteredApprovals.length} requests</span>
            {paginationMeta.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={paginationMeta.totalPages}
                onPageChange={(p) => setPage(p)}
              />
            )}
          </div>
        </div>

        {/* Right: Change Preview Inspector Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Change Preview & Review</h2>
              {selectedApproval && (
                <button onClick={() => setSelectedApproval(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {currentApproval ? (
              <>
                {/* Member Profile Header */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  {currentApproval.memberId?.avatarUrl || currentApproval.draftSnapshot?.avatarUrl ? (
                    <img
                      src={currentApproval.memberId?.avatarUrl || currentApproval.draftSnapshot?.avatarUrl}
                      alt={currentApproval.memberId?.name || 'Member'}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                      {(currentApproval.memberId?.name || 'M').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {currentApproval.memberId?.name || currentApproval.member?.name || 'Team Member'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {currentApproval.memberId?.designation || currentApproval.member?.designation || 'Team Member'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {currentApproval.submittedBy?.email || currentApproval.member?.email}
                    </p>
                  </div>
                </div>

                {/* Requested On Banner */}
                <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-2 text-xs text-purple-900">
                  <Calendar className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>
                    Requested on:{' '}
                    <strong className="font-semibold">
                      {formatDate(currentApproval.submittedAt || currentApproval.createdAt)}
                    </strong>
                  </span>
                </div>

                {/* Submitter Notes if provided */}
                {currentApproval.reviewNote && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-0.5">Submitter Note</span>
                    <p className="text-slate-700 italic">"{currentApproval.reviewNote}"</p>
                  </div>
                )}

                {/* Changes Diff Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-slate-800">Field Changes</p>
                    <span className="text-[10px] text-slate-400">
                      {(currentApproval.diffSummary || []).length} field(s) modified
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                    {(currentApproval.diffSummary || []).length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        Profile content updated with draft changes
                      </div>
                    ) : (
                      (currentApproval.diffSummary || []).map((diff, idx) => {
                        const isComplex =
                          (typeof diff.oldValue === 'object' && diff.oldValue !== null) ||
                          (typeof diff.newValue === 'object' && diff.newValue !== null) ||
                          (typeof diff.oldValue === 'string' && diff.oldValue.startsWith('[')) ||
                          (typeof diff.newValue === 'string' && diff.newValue.startsWith('['));

                        return (
                          <div key={idx} className="p-3 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 text-xs capitalize flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                                {diff.field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                              </span>
                              <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                                Modified
                              </span>
                            </div>

                            {isComplex ? (
                              <div className="space-y-2 pt-1">
                                <div className="p-2.5 rounded-xl bg-rose-50/40 border border-rose-100">
                                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
                                    Previous Value
                                  </span>
                                  {renderFormattedDiffValue(diff.oldValue, diff.field, true)}
                                </div>
                                <div className="p-2.5 rounded-xl bg-emerald-50/40 border border-emerald-100">
                                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                                    Updated Value
                                  </span>
                                  {renderFormattedDiffValue(diff.newValue, diff.field, false)}
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2 pt-1 items-start">
                                <div className="p-2 rounded-xl bg-rose-50/40 border border-rose-100">
                                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-0.5">
                                    Previous
                                  </span>
                                  {renderFormattedDiffValue(diff.oldValue, diff.field, true)}
                                </div>
                                <div className="p-2 rounded-xl bg-emerald-50/40 border border-emerald-100">
                                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                                    Updated
                                  </span>
                                  {renderFormattedDiffValue(diff.newValue, diff.field, false)}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Notes Textarea if pending */}
                {currentApproval.status === 'pending' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Review Notes (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Add notes explaining your approval or feedback..."
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 bg-slate-50/50"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-xs text-slate-400">
                Select a request from the list to inspect details and diffs.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {currentApproval && currentApproval.status === 'pending' && (
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() =>
                  approvalMutation.mutate({
                    id: currentApproval._id,
                    status: 'rejected',
                    reviewNote
                  })
                }
                disabled={approvalMutation.isPending}
                className="flex-1 py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {approvalMutation.isPending ? 'Processing...' : 'Reject Request'}
              </button>
              <button
                onClick={() =>
                  approvalMutation.mutate({
                    id: currentApproval._id,
                    status: 'approved',
                    reviewNote
                  })
                }
                disabled={approvalMutation.isPending}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {approvalMutation.isPending ? 'Processing...' : 'Approve Profile'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
