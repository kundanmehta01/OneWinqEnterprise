import React from 'react';
import { FolderKanban } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';

export default function ProjectsWork({ section }) {
  const items = Array.isArray(section?.content) ? section.content : section?.content?.items || [];
  return <CompanySectionCard title="Projects / Work" icon={FolderKanban}>
    {items.length ? <div className="grid gap-3 sm:grid-cols-2">{items.map((item, index) => <div key={item.title || index} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-2"><h3 className="font-semibold text-slate-800">{item.title || 'Project'}</h3><span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">{item.status || 'Active'}</span></div><p className="mt-2 text-sm leading-5 text-slate-500">{item.description || 'No project description provided.'}</p></div>)}</div> : <p className="text-sm text-slate-500">No projects or work items have been configured.</p>}
  </CompanySectionCard>;
}
