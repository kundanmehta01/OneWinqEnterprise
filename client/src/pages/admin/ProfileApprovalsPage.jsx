import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, Eye, Filter, MoreVertical, Search, Users, XCircle, Briefcase, Award, Calendar, MapPin, Mail, Phone, GraduationCap, Building2, ChevronRight, User, AlertTriangle } from 'lucide-react';
import { useApprovals } from '../../hooks/useApprovals';
import { approvalService } from '../../services/approvalService';
import { useNotification } from '../../hooks/useNotification';
import { ReviewModal } from '../../components/profile-approvals/ReviewModal';
import { RequestChangesModal } from '../../components/profile-approvals/RequestChangesModal';
import { RejectConfirmationModal } from '../../components/profile-approvals/RejectConfirmationModal';
import { Badge } from '../../components/common/Badge';
import { Dropdown } from '../../components/common/Dropdown';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatRelativeTime } from '../../utils/formatDate';

const statusLabels = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', changes_requested: 'Changes Requested' };

export const ProfileApprovalsPage = () => {
  const { approvals, pagination, params, error, loading, updateFilters, changePage, refetch } = useApprovals();
  const { success, error: notifyError } = useNotification();
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [requestChangesOpen, setRequestChangesOpen] = useState(false);
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [search, setSearch] = useState('');
  const visibleApprovals = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? approvals.filter((item) => `${item.memberId?.name || ''} ${item.memberId?.designation || ''} ${item.memberId?.departmentId?.name || ''}`.toLowerCase().includes(query)) : approvals;
  }, [approvals, search]);
  const counts = useMemo(() => approvals.reduce((result, item) => ({ ...result, [item.status]: (result[item.status] || 0) + 1 }), {}), [approvals]);
  const openReview = (approval) => { setSelectedApproval(approval); setReviewOpen(true); };
  const openRequestChanges = (approval) => { setSelectedApproval(approval); setRequestChangesOpen(true); };
  const openRejectConfirm = (approval) => { setSelectedApproval(approval); setRejectConfirmOpen(true); };
  const approveApproval = async (approval) => {
    try {
      await approvalService.review(approval._id, { action: 'approve' });
      success('Profile approved successfully');
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to approve profile');
    }
  };
  const avatarFor = (approval) => approval.memberId?.profileImage || approval.memberId?.avatar || approval.memberId?.profile?.profileImage || '';
  const badge = (status) => status === 'approved' ? <Badge variant="green" dot>Approved</Badge> : status === 'rejected' ? <Badge variant="red" dot>Rejected</Badge> : status === 'changes_requested' ? <Badge variant="amber" dot>Changes Requested</Badge> : <Badge variant="blue" dot>Pending</Badge>;
  const statCards = [
    ['Pending Approvals', counts.pending || 0, Clock3, 'text-violet-600 bg-violet-50'],
    ['Approved', counts.approved || 0, CheckCircle2, 'text-emerald-600 bg-emerald-50'],
    ['Rejected', counts.rejected || 0, XCircle, 'text-rose-600 bg-rose-50'],
    ['Total Requests', pagination.totalItems || approvals.length, Users, 'text-sky-600 bg-sky-50']
  ];

  return <div className="space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Profile Approval</h1><p className="mt-1 text-sm text-slate-500">Review and approve or reject profile changes requested by members.</p></div><button type="button" className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700"><Filter className="h-4 w-4" /> Filters</button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{statCards.map(([label, value, Icon, color]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs text-slate-500">{label}</span><span className={`rounded-full p-2 ${color}`}><Icon className="h-4 w-4" /></span></div><div className="mt-2 text-2xl font-extrabold text-slate-900">{value}</div><div className="mt-1 text-[11px] text-slate-400">Current backend result set</div></div>)}</div>
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200">{[['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['', 'All']].map(([value, label]) => <button key={label} type="button" onClick={() => updateFilters({ status: value })} className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs font-semibold ${params.status === value ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500'}`}>{label} ({value ? counts[value] || 0 : pagination.totalItems || approvals.length})</button>)}</div>
    {loading ? <div className="py-20"><LoadingSpinner message="Loading profile approval requests..." /></div> : error ? <div className="rounded-xl border border-rose-100 bg-rose-50 p-5 text-sm text-rose-700"><AlertCircle className="mr-2 inline h-4 w-4" />{error}</div> : <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row"><label className="relative flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, role or department..." className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none focus:border-indigo-500" /></label><select onChange={(event) => updateFilters({ sort: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600"><option value="newest">Sort: Newest</option><option value="oldest">Sort: Oldest</option></select></div>
        {visibleApprovals.length === 0 ? <EmptyState icon={CheckCircle2} title="No approval requests found" description="There are currently no profile submissions in this review state." /> : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400"><tr><th className="px-4 py-3">Member</th><th className="px-3 py-3">Department</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Requested On</th><th className="px-3 py-3">Changes</th><th className="px-3 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 text-xs">{visibleApprovals.map((app) => <tr key={app._id} className={`cursor-pointer hover:bg-indigo-50/40 ${selectedApproval?._id === app._id ? 'bg-indigo-50/60' : ''}`} onClick={() => setSelectedApproval(app)}><td className="px-4 py-3"><div className="flex items-center gap-2.5">{avatarFor(app) ? <img src={avatarFor(app)} alt="" className="h-8 w-8 rounded-full object-cover" /> : <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">{app.memberId?.name?.charAt(0) || 'E'}</div>}<div><div className="font-bold text-slate-800">{app.memberId?.name || 'Employee'}</div><div className="text-[10px] text-slate-400">{app.submittedBy?.email || '-'}</div></div></div></td><td className="px-3 py-3 text-slate-600">{app.memberId?.departmentId?.name || 'General'}</td><td className="px-3 py-3 text-slate-600">{app.memberId?.designation || '-'}</td><td className="px-3 py-3 text-slate-500">{formatRelativeTime(app.submittedAt)}</td><td className="px-3 py-3"><span className="rounded-full border border-slate-200 px-2 py-1 text-[10px]">{Object.keys(app.draftSnapshot || {}).length || 0} changes</span></td><td className="px-3 py-3">{badge(app.status)}</td><td className="px-4 py-3 text-right"><div className="inline-flex items-center gap-1"><button type="button" onClick={(event) => { event.stopPropagation(); openReview(app); }} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-indigo-600" title="View profile"><Eye className="h-4 w-4" /></button>        <Dropdown
          trigger={<button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-indigo-600" aria-label="Approval actions"><MoreVertical className="h-4 w-4" /></button>}
          items={[
            { label: 'View Details', icon: Eye, onClick: () => openReview(app) },
            ...(app.status === 'pending' ? [
              { label: 'Approve Profile', icon: CheckCircle2, onClick: () => approveApproval(app) },
              { label: 'Request Changes', icon: AlertTriangle, onClick: () => openRequestChanges(app) },
              { label: 'Reject Profile', icon: XCircle, danger: true, onClick: () => openRejectConfirm(app) }
            ] : [])
          ]}
        /></div></td></tr>)}</tbody></table></div>}
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} totalItems={pagination.totalItems} itemsPerPage={pagination.itemsPerPage} onPageChange={changePage} label="requests" />
      </div>
      <aside className="hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:block">
        {selectedApproval ? (
          <ProfilePreviewPanel 
            approval={selectedApproval}
            onClose={() => setSelectedApproval(null)}
            onReview={() => openReview(selectedApproval)}
            onRequestChanges={() => openRequestChanges(selectedApproval)}
            onReject={() => openRejectConfirm(selectedApproval)}
            onApprove={() => approveApproval(selectedApproval)}
            avatarFor={avatarFor}
            badge={badge}
            formatRelativeTime={formatRelativeTime}
          />
        ) : (
          <div className="flex h-full min-h-[400px] items-center justify-center p-5 text-center text-sm text-slate-400">
            Select a request to preview profile changes.
          </div>
        )}
      </aside>
    </div>}
    <ReviewModal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} approval={selectedApproval} onSuccess={refetch} />
    <RequestChangesModal 
      isOpen={requestChangesOpen} 
      onClose={() => setRequestChangesOpen(false)} 
      approval={selectedApproval} 
      onSuccess={refetch} 
    />
    <RejectConfirmationModal 
      isOpen={rejectConfirmOpen} 
      onClose={() => setRejectConfirmOpen(false)} 
      approval={selectedApproval} 
      onSuccess={refetch} 
    />
  </div>;
};

// Profile Preview Panel Component
const ProfilePreviewPanel = ({ approval, onClose, onReview, onRequestChanges, onReject, onApprove, avatarFor, badge, formatRelativeTime }) => {
  const draft = approval.draftSnapshot || {};
  const isPending = approval.status === 'pending';

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-3">
          {avatarFor(approval) ? (
            <img src={avatarFor(approval)} alt="" className="h-12 w-12 rounded-full object-cover border-2 border-slate-100" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700 border-2 border-slate-100">
              {approval.memberId?.name?.charAt(0) || 'E'}
            </div>
          )}
          <div>
            <h2 className="text-base font-bold text-slate-900">{approval.memberId?.name || 'Employee'}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{approval.memberId?.designation || 'Employee'} · {approval.memberId?.departmentId?.name || 'General'}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-light">×</button>
      </div>

      {/* Status Badge */}
      <div className="mb-4">{badge(approval.status)}</div>

      {/* Request Info */}
      <div className="rounded-xl bg-violet-50 p-3 text-xs text-violet-800 mb-5">
        <div className="flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>Requested {approval.submittedAt ? formatRelativeTime(approval.submittedAt) : 'recently'}</span>
        </div>
      </div>

      {/* Profile Changes Summary */}
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Profile Changes</h3>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm text-slate-700">{Object.keys(draft).length || 0} fields updated</p>
          {draft.headline && (
            <div className="mt-2">
              <span className="text-[10px] font-semibold text-slate-500 uppercase">Headline:</span>
              <p className="text-xs text-slate-700 mt-0.5">{draft.headline}</p>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" /> Personal Information
        </h3>
        <div className="space-y-2 text-xs">
          {draft.email && (
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>{draft.email}</span>
            </div>
          )}
          {draft.phone && (
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>{draft.phone}</span>
            </div>
          )}
          {draft.location && (
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {typeof draft.location === 'object' 
                  ? `${draft.location.city}${draft.location.country ? ', ' + draft.location.country : ''}` 
                  : draft.location}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Professional Information */}
      <div className="mb-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
          <Briefcase className="h-3.5 w-3.5" /> Professional Information
        </h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span>{approval.memberId?.departmentId?.name || 'General'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
            <span>{approval.memberId?.designation || '-'}</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      {draft.skills && draft.skills.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5" /> Skills
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {draft.skills.map((skill, idx) => (
              <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-[11px] font-medium">
                {skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {draft.experience && draft.experience.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" /> Experience
          </h3>
          <div className="space-y-2">
            {draft.experience.slice(0, 2).map((exp, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                <p className="font-semibold text-slate-800 text-xs">{exp.title || exp.position}</p>
                <p className="text-[10px] text-slate-500">{exp.company}</p>
              </div>
            ))}
            {draft.experience.length > 2 && (
              <p className="text-[10px] text-slate-500">+{draft.experience.length - 2} more</p>
            )}
          </div>
        </div>
      )}

      {/* Education */}
      {draft.education && draft.education.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5" /> Education
          </h3>
          <div className="space-y-2">
            {draft.education.slice(0, 2).map((edu, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                <p className="font-semibold text-slate-800 text-xs">{edu.degree}</p>
                <p className="text-[10px] text-slate-500">{edu.institution}</p>
              </div>
            ))}
            {draft.education.length > 2 && (
              <p className="text-[10px] text-slate-500">+{draft.education.length - 2} more</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isPending && (
        <div className="mt-6 space-y-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onApprove}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve Profile
          </button>
          <button
            type="button"
            onClick={onRequestChanges}
            className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-600 flex items-center justify-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Request Changes
          </button>
          <button
            type="button"
            onClick={onReject}
            className="w-full rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-700 flex items-center justify-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            Reject Profile
          </button>
        </div>
      )}

      {!isPending && (
        <button
          type="button"
          onClick={onReview}
          className="mt-6 w-full rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 flex items-center justify-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Details
        </button>
      )}
    </div>
  );
};
