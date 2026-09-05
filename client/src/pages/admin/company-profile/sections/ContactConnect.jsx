import React from 'react';
import { Mail, MapPin, Phone, Link2 } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';

export default function ContactConnect({ company }) {
  const location = [company?.location?.address, company?.location?.city, company?.location?.state, company?.location?.country, company?.location?.zipCode].filter(Boolean).join(', ');
  return <CompanySectionCard title="Contact / Connect" icon={Link2}>
    <div className="space-y-3 text-sm text-slate-600">
      <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-indigo-600" />{company?.contact?.email || 'Not provided'}</div>
      <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-indigo-600" />{company?.contact?.phone || 'Not provided'}</div>
      <div className="flex items-center gap-3"><Link2 className="h-4 w-4 text-indigo-600" />{company?.website || 'Not provided'}</div>
      <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-indigo-600" />{location || 'Address not provided'}</div>
      {company?.socialLinks?.length > 0 && <div className="flex flex-wrap gap-2 pt-2">{company.socialLinks.filter((link) => link.isVisible !== false).map((link) => <a key={link.platform} href={link.url} target="_blank" rel="noreferrer" className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{link.platform}</a>)}</div>}
    </div>
  </CompanySectionCard>;
}
