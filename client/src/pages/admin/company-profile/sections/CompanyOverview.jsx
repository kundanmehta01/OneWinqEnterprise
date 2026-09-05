import React from 'react';
import { Building2 } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';

export default function CompanyOverview({ company }) {
  return <CompanySectionCard title="Company Overview" icon={Building2}>
    {company?.branding?.coverUrl || company?.branding?.bannerUrl ? <img src={company.branding.coverUrl || company.branding.bannerUrl} alt="Company banner" className="mb-4 h-44 w-full rounded-xl object-cover" /> : <div className="mb-4 flex h-44 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-sm text-indigo-600">No company banner configured</div>}
    <p className="text-sm leading-6 text-slate-600">{company?.description || 'No company description has been configured.'}</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {[['Industry', company?.industry], ['Company type', company?.companyType], ['Company size', company?.companySize], ['Founded', company?.foundedYear]].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-sm font-semibold text-slate-800">{value || 'Not provided'}</div></div>)}
    </div>
  </CompanySectionCard>;
}
