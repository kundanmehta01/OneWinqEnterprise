import React, { useState } from 'react';
import { Award } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';
import { fallbackContent } from '../companyData';

export default function Achievements({ section }) {
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(section?.content) ? section.content : section?.content?.items || fallbackContent.achievements.map((title) => ({ title, description: 'Recognition for OneWinq innovation and enterprise impact.' }));
  return <CompanySectionCard id="achievements" title="Achievements" icon={Award}>
    <div className="grid gap-3 sm:grid-cols-2">{items.slice(0, expanded ? items.length : 2).map((item, index) => <div key={item.title || index} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4"><span className="rounded-xl bg-amber-100 p-2 text-amber-600"><Award className="h-4 w-4" /></span><div><h3 className="font-semibold text-slate-800">{item.title || 'Recognition'}</h3><p className="mt-1 text-sm text-slate-500">{item.description || item.issuer || 'Recognition for OneWinq innovation and enterprise impact.'}</p><p className="mt-2 text-[11px] font-semibold text-slate-400">{item.year || '2024'}</p></div></div>)}</div>
    {items.length > 2 && <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-4 text-xs font-bold text-indigo-600">{expanded ? 'Show less' : 'View all achievements'} →</button>}
  </CompanySectionCard>;
}
