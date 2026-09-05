import React from 'react';
import { Users } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';

export default function CompanyTeam({ members = [] }) {
  return <CompanySectionCard title="Team" icon={Users}>
    {members.length ? <div className="grid gap-3 sm:grid-cols-2">{members.slice(0, 8).map((member) => <div key={member._id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-100 font-bold text-indigo-700">{member.profileId?.published?.avatarUrl ? <img src={member.profileId.published.avatarUrl} alt={member.name} className="h-full w-full object-cover" /> : member.name?.charAt(0)}</div><div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-800">{member.name}</div><div className="truncate text-xs text-slate-500">{member.designation || 'Team member'} · {member.departmentId?.name || 'Unassigned'}</div></div></div>)}</div> : <p className="text-sm text-slate-500">No team members are available.</p>}
  </CompanySectionCard>;
}
