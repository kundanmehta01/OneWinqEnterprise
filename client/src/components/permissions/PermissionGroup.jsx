import React from 'react';

export const PermissionGroup = ({ moduleName, permissions = [], selected = [], onToggle }) => {
  return (
    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{moduleName}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {permissions.map((p) => {
          const isChecked = selected.includes(p.code);
          return (
            <label key={p.code} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle?.(p.code)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>{p.name || p.code}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
