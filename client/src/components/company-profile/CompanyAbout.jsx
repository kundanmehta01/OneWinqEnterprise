import React from 'react';

export const CompanyAbout = ({ value = '', onChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
        About Company / Overview
      </label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder="Provide a comprehensive summary of your enterprise mission, vision, and core capabilities..."
        className="w-full rounded-xl border border-slate-200/80 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};
