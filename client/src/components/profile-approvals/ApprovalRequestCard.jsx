import React from 'react';
import { Eye } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatRelativeTime } from '../../utils/formatDate';

export const ApprovalRequestCard = ({ approval, selected, onSelect, onReview }) => {
  const member = approval.memberId || {};
  const avatar = approval.draftSnapshot?.profileImage || approval.draftSnapshot?.avatar;
  return <article onClick={() => onSelect(approval)} className={`cursor-pointer border-b border-slate-100 p-4 transition hover:bg-indigo-50/40 ${selected ? 'bg-indigo-50/60' : ''}`}>
    <div className="flex items-start gap-3">{avatar ? <img src={avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" /> : <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">{member.name?.charAt(0) || 'E'}</div>}<div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-bold text-slate-800">{member.name || 'Employee'}</h3><p className="text-xs text-slate-500">{member.designation || '—'} · {member.departmentId?.name || 'General'}</p></div><StatusBadge status={approval.status} /></div><p className="mt-2 text-xs text-slate-500">Submitted {formatRelativeTime(approval.submittedAt)} · {approval.diffSummary?.length || Object.keys(approval.draftSnapshot || {}).length} updated fields</p><div className="mt-3 flex items-center justify-between"><button type="button" onClick={(event) => { event.stopPropagation(); onSelect(approval); }} className="text-xs font-semibold text-indigo-700"><Eye className="mr-1 inline h-3.5 w-3.5" />View details</button>{approval.status === 'pending' && <button type="button" onClick={(event) => { event.stopPropagation(); onReview(approval); }} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">Review Request</button>}</div></div></div>
  </article>;
};
