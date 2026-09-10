import React from 'react';
import { EmployeeProfileHeader } from './EmployeeProfileHeader';

export const EmployeeProfileView = ({ profile, member }) => {
  return (
    <div className="space-y-6">
      <EmployeeProfileHeader profile={profile} member={member} />
      <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About</h3>
          <p className="text-xs text-slate-700 mt-1">{profile?.bio || 'No bio provided'}</p>
        </div>
      </div>
    </div>
  );
};
