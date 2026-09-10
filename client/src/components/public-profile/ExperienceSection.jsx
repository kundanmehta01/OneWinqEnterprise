import React from 'react';
import { Briefcase } from 'lucide-react';

export const ExperienceSection = ({ experience = [] }) => {
  if (!experience.length) return null;
  return (
    <div className="py-4 border-t border-slate-100">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Experience</h3>
      <div className="space-y-3">
        {experience.map((e, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{e.title}</h4>
              <p className="text-[11px] text-slate-500">{e.company}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
