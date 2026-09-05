import React from 'react';
import { Eye, FolderKanban, Images, Users, Trophy } from 'lucide-react';

const cards = [
  ['Total Members', 'members', Users, 'text-indigo-600 bg-indigo-50'],
  ['Projects Completed', 'projects', FolderKanban, 'text-emerald-600 bg-emerald-50'],
  ['Achievements', 'achievements', Trophy, 'text-amber-600 bg-amber-50'],
  ['Profile Views', 'views', Eye, 'text-pink-600 bg-pink-50'],
  ['Connected Profiles', 'profiles', Images, 'text-sky-600 bg-sky-50']
];

export default function CompanyStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map(([label, key, Icon, color]) => (
        <div key={key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{label}</span>
            <span className={`rounded-lg p-2 ${color}`}><Icon className="h-4 w-4" /></span>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900">{Number(stats?.[key] || 0).toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-slate-400">Backend synchronized</div>
        </div>
      ))}
    </div>
  );
}
