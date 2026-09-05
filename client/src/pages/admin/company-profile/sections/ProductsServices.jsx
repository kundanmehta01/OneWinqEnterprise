import React from 'react';
import { Boxes } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';

export default function ProductsServices({ section }) {
  const values = Array.isArray(section?.content) ? section.content : section?.content?.items || [];
  return <CompanySectionCard title="Products / Services" icon={Boxes}>
    {values.length ? <div className="grid gap-3 sm:grid-cols-2">{values.map((item, index) => <div key={item.title || index} className="rounded-xl border border-slate-200 p-4"><h3 className="font-semibold text-slate-800">{item.title || item.name || 'Untitled service'}</h3><p className="mt-1 text-sm leading-5 text-slate-500">{item.description || item.features || 'No description provided.'}</p></div>)}</div> : <p className="text-sm text-slate-500">No products or services have been configured in the company profile.</p>}
  </CompanySectionCard>;
}
