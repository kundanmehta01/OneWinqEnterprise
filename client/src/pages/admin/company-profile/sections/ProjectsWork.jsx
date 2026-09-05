import React from 'react';
import { FolderKanban } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';
import { companyData, fallbackContent } from '../companyData';

export default function ProjectsWork({ section }) {
  const items = Array.isArray(section?.content) ? section.content : section?.content?.items || fallbackContent.projects.map(([title, description, status]) => ({ title, description, status }));
  return <CompanySectionCard id="projects" title="Projects / Work" icon={FolderKanban}>
    <div className="grid gap-3 sm:grid-cols-2">{items.map((item, index) => <div key={item.title || index} className="overflow-hidden rounded-xl border border-slate-200"><img src={item.image || companyData.projectImages[index % companyData.projectImages.length]} alt={item.title} className="h-28 w-full object-cover" /><div className="p-4"><div className="flex items-center justify-between gap-2"><h3 className="font-semibold text-slate-800">{item.title || 'Project'}</h3><span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">{item.status || 'Active'}</span></div><p className="mt-2 text-sm leading-5 text-slate-500">{item.description || 'No project description provided.'}</p></div></div>)}</div>
  </CompanySectionCard>;
}
