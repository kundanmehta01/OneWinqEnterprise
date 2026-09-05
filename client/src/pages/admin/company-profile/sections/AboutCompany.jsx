import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import CompanySectionCard from '../common/CompanySectionCard';

export default function AboutCompany({ company }) {
  const [expanded, setExpanded] = useState(false);
  const about = company?.about || {};
  return <CompanySectionCard id="about" title="About Company" icon={BookOpen}>
    <p className="mb-4 text-sm leading-6 text-slate-600">{about.aboutCompany || 'OneWinq is a next-generation digital identity platform that helps individuals, professionals and organizations create trusted digital identities. Our platform enables businesses and teams to showcase their profiles, achievements, services and professional presence through modern digital experiences.'}</p>
    <div className="space-y-4 text-sm text-slate-600">
      <div><h3 className="font-bold text-slate-800">Vision</h3><p className="mt-1 leading-6">{about.vision || "To build the world's most trusted digital identity ecosystem."}</p></div>
      {expanded && <><div><h3 className="font-bold text-slate-800">Mission</h3><p className="mt-1 leading-6">{about.mission || 'Empowering businesses and professionals with secure, customizable and connected digital identities.'}</p></div>
        <div><h3 className="font-bold text-slate-800">Company story</h3><p className="mt-1 leading-6">{about.aboutCompany || 'OneWinq was created to simplify professional networking and help people represent themselves digitally in a smarter way.'}</p></div></>}
    </div>
    <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-4 text-xs font-bold text-indigo-600">
      {expanded ? 'Show less' : 'View all'} →
    </button>
  </CompanySectionCard>;
}
