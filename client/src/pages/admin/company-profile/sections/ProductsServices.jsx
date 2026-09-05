import React, { useState } from 'react';
import { BarChart3, Boxes, BriefcaseBusiness, UsersRound } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';
import { fallbackContent } from '../companyData';

export default function ProductsServices({ section }) {
  const [expanded, setExpanded] = useState(false);
  const values = Array.isArray(section?.content) ? section.content : section?.content?.items || fallbackContent.products.map(([title, description]) => ({ title, description }));
  const descriptions = {
    'OneWinq Digital Identity': 'Create and manage trusted professional digital profiles for individuals, teams, and organizations.',
    'Smart Digital Cards': 'Share your professional identity instantly through a modern, memorable digital card experience.',
    'Enterprise Identity Management': 'Manage company teams, employee profiles, permissions, and organizational identity from one place.',
    'AI Powered Assistant': 'Use intelligent tools to write, improve, and grow your professional profile with less effort.'
  };
  return <CompanySectionCard id="services" title="Products / Services" icon={Boxes}>
    <div className="grid items-stretch gap-4 sm:grid-cols-2">{values.slice(0, expanded ? values.length : 4).map((item, index) => {
      const title = item.title || item.name || 'Untitled service';
      const icons = [Boxes, BriefcaseBusiness, UsersRound, BarChart3];
      const Icon = icons[index % icons.length];
      return <div key={title || index} className="flex h-full min-h-[190px] flex-col rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-indigo-200 hover:bg-white hover:shadow-sm">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-indigo-700"><Icon className="h-4 w-4" /></span>
        <div className="flex flex-1 flex-col pt-3">
          <h3 className="min-h-[40px] text-sm font-bold leading-5 text-slate-800">{title}</h3>
          <p className="mt-2 line-clamp-3 min-h-[66px] text-sm leading-5 text-slate-500">{item.description || item.features || descriptions[title] || 'A professional OneWinq solution designed to help teams build a trusted digital presence.'}</p>
          <button type="button" className="mt-auto pt-4 text-left text-xs font-bold text-indigo-600">View details →</button>
        </div>
      </div>;
    })}</div>
    {values.length > 4 && <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-4 text-xs font-bold text-indigo-600">{expanded ? 'Show less' : 'View all services'} →</button>}
  </CompanySectionCard>;
}
