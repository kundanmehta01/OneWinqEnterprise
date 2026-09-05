import React from 'react';
import { Award } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';
import { companyData, fallbackContent } from '../companyData';

export default function Achievements({ section }) {
  const items = Array.isArray(section?.content) ? section.content : section?.content?.items || fallbackContent.achievements.map((title) => ({ title, description: 'Recognition for OneWinq innovation and enterprise impact.' }));
  return <CompanySectionCard id="achievements" title="Achievements" icon={Award}>
    <div className="grid gap-3 sm:grid-cols-2">{items.map((item, index) => <div key={item.title || index} className="overflow-hidden rounded-xl border border-slate-200"><img src={item.image || companyData.achievementImages[index % companyData.achievementImages.length]} alt={item.title} className="h-24 w-full object-cover" /><div className="flex gap-3 p-4"><Award className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" /><div><h3 className="font-semibold text-slate-800">{item.title || 'Recognition'}</h3><p className="mt-1 text-sm text-slate-500">{item.description || item.issuer || 'Recognition for OneWinq innovation and enterprise impact.'}</p></div></div></div>)}</div>
  </CompanySectionCard>;
}
