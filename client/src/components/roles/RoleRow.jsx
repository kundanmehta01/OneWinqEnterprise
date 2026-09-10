import React from 'react';
import { Shield, Users } from 'lucide-react';

export const RoleRow = ({ role, onSelect, isSelected }) => {
  return (
    <div
      onClick={() => onSelect?.(role)}
      className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between ${
        isSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <Shield className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800">{role.name}</h4>
          <p className="text-[11px] text-slate-400">{role.description || 'Custom role'}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
        <Users className="w-3.5 h-3.5 text-slate-400" />
        <span>{role.memberCount || 0}</span>
      </div>
    </div>
  );
};
