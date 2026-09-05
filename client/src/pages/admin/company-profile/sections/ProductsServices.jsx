import React from 'react';
import { Boxes } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';
import { companyData, fallbackContent } from '../companyData';

export default function ProductsServices({ section }) {
  const values = Array.isArray(section?.content) ? section.content : section?.content?.items || fallbackContent.products.map(([title, description]) => ({ title, description }));
  return <CompanySectionCard id="services" title="Products / Services" icon={Boxes}>
    <div className="grid gap-3 sm:grid-cols-2">{values.map((item, index) => <div key={item.title || index} className="overflow-hidden rounded-xl border border-slate-200"><img src={item.image || companyData.productsImages[index % companyData.productsImages.length]} alt={item.title} className="h-28 w-full object-cover" /><div className="p-4"><h3 className="font-semibold text-slate-800">{item.title || item.name || 'Untitled service'}</h3><p className="mt-1 text-sm leading-5 text-slate-500">{item.description || item.features || 'No description provided.'}</p><button type="button" className="mt-3 text-xs font-bold text-indigo-600">View details</button></div></div>)}</div>
  </CompanySectionCard>;
}
