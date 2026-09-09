import React from 'react';
import { ExternalLink } from 'lucide-react';

export const ProjectsSection = ({ projects = [] }) => {
  if (!projects.length) return null;
  return (
    <div className="py-4 border-t border-slate-100">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Projects</h3>
      <div className="space-y-2">
        {projects.map((p, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">{p.title}</span>
            {p.link && (
              <a href={p.link} target="_blank" rel="noreferrer" className="text-indigo-600">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
