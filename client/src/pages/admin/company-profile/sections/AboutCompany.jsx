import React from 'react';
import { BookOpen } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';

export default function AboutCompany({ company }) {
  const about = company?.about || {};
  return <CompanySectionCard title="About Company" icon={BookOpen}>
    <div className="space-y-4 text-sm text-slate-600">
      <div><h3 className="font-bold text-slate-800">Vision</h3><p className="mt-1 leading-6">{about.vision || 'No vision configured.'}</p></div>
      <div><h3 className="font-bold text-slate-800">Mission</h3><p className="mt-1 leading-6">{about.mission || 'No mission configured.'}</p></div>
      <div><h3 className="font-bold text-slate-800">Company story</h3><p className="mt-1 leading-6">{about.aboutCompany || 'No company story configured.'}</p></div>
    </div>
  </CompanySectionCard>;
}
