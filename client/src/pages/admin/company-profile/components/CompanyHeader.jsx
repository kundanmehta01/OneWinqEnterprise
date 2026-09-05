import React from 'react';
import { CheckCircle2, Globe2, MapPin, Pencil, Phone } from 'lucide-react';

export default function CompanyHeader({ company, onEdit, data }) {
  const logo = company?.branding?.logoUrl || data.companyLogo;
  const cover = company?.branding?.coverUrl || company?.branding?.bannerUrl || data.coverImage;
  return (
    <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-950 via-indigo-800 to-violet-700 text-white shadow-lg">
      <div className="relative h-28 bg-cover bg-center opacity-80" style={cover ? { backgroundImage: `url(${cover})` } : undefined}>
        {!cover && <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 to-violet-700" />}
      </div>
      <div className="relative -mt-10 flex flex-col gap-4 px-6 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-end gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/40 bg-slate-950 shadow-xl">
            {logo ? <img src={logo} alt={`${company?.name || 'Company'} logo`} className="h-full w-full object-contain" /> : <span className="text-2xl font-black text-violet-300">{(company?.name || 'C').charAt(0)}</span>}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold">{company?.name || 'Company'}</h2>
              {company?.isPublic !== false && <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold"><CheckCircle2 className="h-3 w-3" /> Verified</span>}
            </div>
            <p className="mt-1 text-sm text-indigo-100">{company?.tagline || 'The Enterprise Digital Identity & People Platform'}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-indigo-100">
              {company?.website && <span className="inline-flex items-center gap-1"><Globe2 className="h-3 w-3" />{company.website}</span>}
              {(company?.location?.city || company?.location?.country) && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{[company.location.city, company.location.country].filter(Boolean).join(', ')}</span>}
              {company?.contact?.email && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{company.contact.email}</span>}
            </div>
          </div>
        </div>
        <button type="button" onClick={onEdit} className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-800 shadow-sm hover:bg-indigo-50"><Pencil className="h-4 w-4" /> Edit Profile</button>
      </div>
    </div>
  );
}
