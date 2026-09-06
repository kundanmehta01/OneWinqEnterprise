import React from 'react';

export const PermissionSelector = ({ grouped = {}, selected = [], onChange }) => {
  const handleToggle = (code) => {
    if (selected.includes(code)) {
      onChange(selected.filter((c) => c !== code));
    } else {
      onChange([...selected, code]);
    }
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
      {Object.entries(grouped).map(([moduleName, perms]) => (
        <div key={moduleName} className="p-3 border border-slate-100 rounded-xl bg-slate-50/30 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase">{moduleName}</span>
          <div className="grid grid-cols-2 gap-1.5">
            {perms.map((p) => (
              <label key={p.code} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(p.code)}
                  onChange={() => handleToggle(p.code)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="truncate">{p.name || p.code}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
