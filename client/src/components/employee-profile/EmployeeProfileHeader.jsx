import React from 'react';
import { Badge } from '../common/Badge';

export const EmployeeProfileHeader = ({ profile, member }) => {
  return (
    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-card">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white font-black text-2xl flex items-center justify-center">
        {member?.name?.charAt(0) || 'E'}
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">{member?.name || 'Employee'}</h2>
        <p className="text-xs text-slate-400">{member?.designation || 'Team Member'}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={profile?.approvalStatus === 'approved' ? 'green' : 'amber'}>
            {profile?.approvalStatus || 'Draft'}
          </Badge>
          <span className="text-[11px] text-slate-400">
            Completeness: {profile?.completionPercentage ?? 0}%
          </span>
        </div>
      </div>
    </div>
  );
};
