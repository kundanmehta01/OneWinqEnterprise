import React, { useState } from 'react';
import { FolderKanban, LoaderCircle } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';
import { fallbackContent } from '../companyData';

export default function ProjectsWork({ section }) {
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(section?.content) ? section.content : section?.content?.items || fallbackContent.projects.map(([title, description, status]) => ({ title, description, status }));
  return <CompanySectionCard id="projects" title="Projects / Work" icon={FolderKanban}>
    <div className="space-y-3">{items.slice(0, expanded ? items.length : 2).map((item, index) => { const progress = Number(item.progress || (item.status === 'Completed' ? 100 : 75)); return <div key={item.title || index} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3"><div className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><LoaderCircle className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-semibold text-slate-800">{item.title || 'Project'}</h3><span className="whitespace-nowrap rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">{item.status || 'Active'}</span></div><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.description || 'No project description provided.'}</p><div className="mt-2 flex items-center gap-2"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-violet-600" style={{ width: `${progress}%` }} /></div><span className="text-[10px] font-bold text-slate-500">{progress}%</span></div></div></div></div>; })}</div>
    {items.length > 2 && <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-4 text-xs font-bold text-indigo-600">{expanded ? 'Show less' : 'View all projects'} →</button>}
  </CompanySectionCard>;
}
