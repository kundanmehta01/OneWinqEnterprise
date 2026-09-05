import React, { useState } from 'react';
import { Users } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';
import { companyData } from '../companyData';

export default function CompanyTeam({ members = [] }) {
  const [expanded, setExpanded] = useState(false);
  const displayMembers = members.length ? members.slice(0, 8) : ['Founder & CEO', 'Product Manager', 'Frontend Developer', 'UI/UX Designer'].map((designation, index) => ({ _id: designation, name: ['Aarav Mehta', 'Priya Sharma', 'Rohan Kumar', 'Ananya Singh'][index], designation, image: companyData.teamImages[index] }));
  return <CompanySectionCard id="team" title="Team" icon={Users}>
    <div className="grid gap-3 sm:grid-cols-2">{displayMembers.slice(0, expanded ? displayMembers.length : 4).map((member, index) => <div key={member._id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><div className="h-12 w-12 overflow-hidden rounded-full bg-indigo-100">{member.image || member.profileId?.published?.avatarUrl ? <img src={member.image || member.profileId.published.avatarUrl} alt={member.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center font-bold text-indigo-700">{member.name?.charAt(0)}</div>}</div><div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-800">{member.name}</div><div className="truncate text-xs text-slate-500">{member.designation || 'Team member'} · {member.departmentId?.name || 'Unassigned'}</div></div></div>)}</div>
    {displayMembers.length > 4 && <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-4 text-xs font-bold text-indigo-600">{expanded ? 'Show less' : 'View all members'} →</button>}
  </CompanySectionCard>;
}
