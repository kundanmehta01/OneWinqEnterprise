import React from 'react';
import { Mail, MapPin, Phone, Link2 } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';

export default function ContactConnect({ company }) {
  const location = [company?.location?.address, company?.location?.city, company?.location?.state, company?.location?.country, company?.location?.zipCode].filter(Boolean).join(', ');
  return <CompanySectionCard id="contact" title="Contact / Connect" icon={Link2}>
    <div className="space-y-3 text-sm text-slate-600">
      <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-indigo-600" />{company?.contact?.email || 'hello@onewinq.com'}</div>
      <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-indigo-600" />{company?.contact?.phone || '+91 98765 43210'}</div>
      <div className="flex items-center gap-3"><Link2 className="h-4 w-4 text-indigo-600" />{company?.website || 'www.onewinq.com'}</div>
      <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-indigo-600" />{location || 'India'}</div>
      <div className="flex flex-wrap gap-2 pt-2">{(company?.socialLinks?.length ? company.socialLinks : [{ platform: 'LinkedIn', url: 'https://linkedin.com' }, { platform: 'Instagram', url: 'https://instagram.com' }, { platform: 'Twitter', url: 'https://twitter.com' }]).filter((link) => link.isVisible !== false).map((link) => <a key={link.platform} href={link.url} target="_blank" rel="noreferrer" className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{link.platform}</a>)}</div>
    </div>
  </CompanySectionCard>;
}
