import React from 'react';

export const SkillsSection = ({ skills = [], primaryColor = '#6366F1' }) => {
  if (!skills.length) return null;
  return (
    <div className="py-4 border-t border-slate-100">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((s, idx) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${primaryColor}15`,
              color: primaryColor
            }}
          >
            {s.name || s}
          </span>
        ))}
      </div>
    </div>
  );
};
