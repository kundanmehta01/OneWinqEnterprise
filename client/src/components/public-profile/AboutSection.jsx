import React from 'react';

export const AboutSection = ({ bio }) => {
  if (!bio) return null;
  return (
    <div className="py-4 border-t border-slate-100">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">About</h3>
      <p className="text-sm text-slate-700 leading-relaxed">{bio}</p>
    </div>
  );
};
