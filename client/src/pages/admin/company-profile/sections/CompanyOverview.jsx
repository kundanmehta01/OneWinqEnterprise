import React from 'react';
import { Building2 } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';

import { companyData } from '../companyData';

export default function CompanyOverview({ company }) {
  return <CompanySectionCard id="overview" title="Company Overview" icon={Building2}>
    <img src={company?.branding?.coverUrl || company?.branding?.bannerUrl || companyData.officeImage} alt="OneWinq office" className="mb-4 h-44 w-full rounded-xl object-cover" />
    <p className="text-sm leading-6 text-slate-600">{company?.description || 'OneWinq builds trusted digital identities for people and organizations through modern, connected experiences.'}</p>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {[['Industry', company?.industry || 'Technology & Digital Identity'], ['Company type', company?.companyType || 'Private Company'], ['Company size', company?.companySize || '51-200 Employees'], ['Founded', company?.foundedYear || '2024'], ['Location', company?.location?.country || 'India']].map(([label, value]) => <div key={label} className="rounded-lg bg-slate-50 p-3"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-sm font-semibold text-slate-800">{value}</div></div>)}
    </div>
  </CompanySectionCard>;
}
