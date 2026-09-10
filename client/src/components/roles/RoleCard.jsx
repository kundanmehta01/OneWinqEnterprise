import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const RoleCard = ({ role, onSelect }) => {
  return (
    <div
      onClick={() => onSelect?.(role)}
      className="p-5 rounded-2xl bg-white border border-slate-100 shadow-card hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-5 h-5 text-indigo-600" />
        <h4 className="text-sm font-bold text-slate-900">{role.name}</h4>
      </div>
      <p className="text-xs text-slate-500 mb-3">{role.description || 'System access role'}</p>
      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
        {role.permissions?.length || 0} Permissions
      </span>
    </div>
  );
};
