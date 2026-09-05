import React from 'react';
import { Award } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';

export default function Achievements({ section }) {
  const items = Array.isArray(section?.content) ? section.content : section?.content?.items || [];
  return <CompanySectionCard title="Achievements" icon={Award}>
    {items.length ? <div className="space-y-3">{items.map((item, index) => <div key={item.title || index} className="flex gap-3 rounded-xl border border-slate-200 p-4"><Award className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" /><div><h3 className="font-semibold text-slate-800">{item.title || 'Recognition'}</h3><p className="mt-1 text-sm text-slate-500">{item.description || item.issuer || 'No details provided.'}</p></div></div>)}</div> : <p className="text-sm text-slate-500">No achievements or certifications have been configured.</p>}
  </CompanySectionCard>;
}
