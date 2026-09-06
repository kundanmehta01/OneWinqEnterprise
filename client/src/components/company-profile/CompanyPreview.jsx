import React from 'react';
import { ExternalLink } from 'lucide-react';

export const CompanyPreview = ({ form = {} }) => {
  const primaryColor = form.branding?.primaryColor || '#6366F1';

  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-card">
      <div className="h-28 w-full relative" style={{ backgroundColor: primaryColor }}>
        {form.branding?.bannerUrl && (
          <img src={form.branding.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4 pt-0 relative">
        <div
          className="w-14 h-14 rounded-2xl border-2 border-white shadow-md flex items-center justify-center text-white text-xl font-black -mt-7 mb-2"
          style={{ backgroundColor: primaryColor }}
        >
          {form.branding?.logoUrl ? (
            <img src={form.branding.logoUrl} alt="Logo" className="w-full h-full rounded-2xl object-cover" />
          ) : (
            form.name?.charAt(0) || 'C'
          )}
        </div>
        <h4 className="text-sm font-bold text-slate-900">{form.name || 'Company Name'}</h4>
        <p className="text-[11px] text-slate-400">{form.tagline || 'Company tagline'}</p>
        <a
          href="/p/company"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
        >
          <ExternalLink className="w-3 h-3" /> Preview Live Portal
        </a>
      </div>
    </div>
  );
};
