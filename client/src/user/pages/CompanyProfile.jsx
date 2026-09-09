import React, { useState, useEffect } from 'react';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  ShieldCheck,
  Calendar,
  Mail,
  ExternalLink,
  Award,
  Sparkles,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { userDirectoryService } from '../services/userDirectoryService';

export default function CompanyProfile() {
  const [company, setCompany] = useState({
    name: 'OneWinq Enterprise Solutions',
    brandName: 'onewinq',
    tagline: 'People. Possibilities. Progress.',
    verified: true,
    founded: '2021',
    industry: 'Enterprise Software & Identity Platforms',
    headquarters: 'Indore, Madhya Pradesh, India',
    employeeRange: '150 - 500 Employees',
    website: 'https://onewinq.com',
    supportEmail: 'support@onewinq.com',
    description:
      'OneWinq Enterprise empowers modern organizations with intelligent digital identity, seamless employee verification, interactive business cards, and collaborative enterprise networks designed for high-velocity teams.',
    coreValues: [
      { title: 'People First', desc: 'Fostering inclusive culture where every team member is empowered to lead and innovate.' },
      { title: 'Security & Trust', desc: 'Zero-trust enterprise architecture safeguarding organization data at every boundary.' },
      { title: 'Velocity with Quality', desc: 'Delivering robust, scalable software quickly without compromising craft.' }
    ],
    locations: [
      { city: 'Indore, MP', address: 'Tech Park Campus, Phase 2', type: 'Global Headquarters' },
      { city: 'Bangalore, KA', address: 'Indiranagar Tech Hub', type: 'Engineering & R&D Center' },
      { city: 'Pune, MH', address: 'Viman Nagar Silicon Center', type: 'Operations & Support' }
    ]
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Company Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="h-44 sm:h-52 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 relative p-6 sm:p-8 flex flex-col justify-end">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center p-3 text-indigo-600 font-black text-2xl">
                1W
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{company.name}</h1>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs sm:text-sm text-indigo-200 mt-0.5">{company.tagline}</p>
              </div>
            </div>

            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-xl text-xs font-semibold transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Visit Website</span>
              <ExternalLink className="w-3 h-3 text-white/70" />
            </a>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 p-4 sm:p-6 bg-slate-50/50">
          <div className="p-2 sm:px-4">
            <p className="text-[11px] text-gray-400 uppercase font-semibold">Industry</p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">{company.industry}</p>
          </div>
          <div className="p-2 sm:px-4">
            <p className="text-[11px] text-gray-400 uppercase font-semibold">Headquarters</p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">{company.headquarters}</p>
          </div>
          <div className="p-2 sm:px-4">
            <p className="text-[11px] text-gray-400 uppercase font-semibold">Company Size</p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">{company.employeeRange}</p>
          </div>
          <div className="p-2 sm:px-4">
            <p className="text-[11px] text-gray-400 uppercase font-semibold">Founded</p>
            <p className="text-xs font-bold text-gray-800 mt-0.5">{company.founded}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: About & Core Values */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: About & Values */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>About Organization</span>
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">{company.description}</p>
          </div>

          {/* Core Values */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-indigo-600" />
              <span>Our Principles & Culture</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {company.coreValues.map((val, idx) => (
                <div key={idx} className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-100/70 space-y-1.5">
                  <h3 className="text-xs font-bold text-indigo-950">{val.title}</h3>
                  <p className="text-[11px] text-gray-600 leading-snug">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Office Locations */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Workspaces & Hubs</span>
            </h2>
            <div className="space-y-4">
              {company.locations.map((loc, idx) => (
                <div key={idx} className="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-900">{loc.city}</h3>
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {loc.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">{loc.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
