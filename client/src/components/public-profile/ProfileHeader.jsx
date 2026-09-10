import React from 'react';
import { CheckCircle } from 'lucide-react';

export const ProfileHeader = ({ profile = {}, member = {}, primaryColor = '#6366F1' }) => {
  const name = member.name || 'Team Member';

  return (
    <div className="flex items-start gap-4">
      <div
        className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white text-3xl font-extrabold flex-shrink-0"
        style={{ backgroundColor: primaryColor }}
      >
        {member.avatarUrl ? (
          <img src={member.avatarUrl} alt={name} className="w-full h-full rounded-2xl object-cover" />
        ) : (
          name.charAt(0)
        )}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <h1 className="text-xl font-extrabold text-slate-900">{name}</h1>
          <CheckCircle className="w-4 h-4 text-indigo-600 fill-indigo-600 text-white" />
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{member.designation}</p>
        <p className="text-xs text-slate-400 mt-1">{profile.headline}</p>
      </div>
    </div>
  );
};
