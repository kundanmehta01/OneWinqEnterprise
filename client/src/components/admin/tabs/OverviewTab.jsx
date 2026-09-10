import React from 'react';
import { Calendar, MapPin, Users, Image as ImageIcon, Sparkles, Building2 } from 'lucide-react';
import { useCompanyProfileStore } from '../../../stores/companyProfileStore';
import { ImageUploadInput } from '../../common/ImageUploadInput';

export const OverviewTab = () => {
  const { draft, updateField } = useCompanyProfileStore();
  if (!draft) return null;

  const overviewStats = draft.overviewStats || { foundedYear: '2024', locationShort: 'Indore', teamSize: '25+' };
  const branding = draft.branding || {};

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Company Identity & Overview</h3>
        <p className="text-xs text-slate-500">Core business metadata, profile photo, background cover banner, legal name, tagline, and highlighted stats.</p>
      </div>

      {/* Visual Identity: Profile Photo & Cover Uploaders */}
      <div className="p-5 bg-purple-50/40 border border-purple-100 rounded-3xl space-y-5 shadow-2xs">
        <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4" /> Company Profile Photo & Background Cover
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Profile Photo / Logo */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <ImageUploadInput
              label="Company Profile Photo / Logo"
              description="Upload official avatar badge from your device or enter URL"
              value={branding.logoUrl || ''}
              onChange={(url) => updateField('branding.logoUrl', url)}
              aspectRatio="square"
              entityType="company"
              placeholder="https://.../logo.png"
            />
          </div>

          {/* Background Cover Banner */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <ImageUploadInput
              label="Background Cover Banner"
              description="Wide banner displayed behind the company avatar"
              value={branding.coverUrl || ''}
              onChange={(url) => updateField('branding.coverUrl', url)}
              aspectRatio="banner"
              entityType="company"
              placeholder="https://.../cover.jpg"
            />
          </div>
        </div>
      </div>

      {/* Main Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Company Legal / Brand Name</label>
          <input
            type="text"
            value={draft.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
            placeholder="e.g. OneWinq Technologies Pvt. Ltd."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Industry / Domain</label>
          <input
            type="text"
            value={draft.industry || ''}
            onChange={(e) => updateField('industry', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
            placeholder="e.g. Technology / SaaS / AI"
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Company Tagline Quote</label>
          <input
            type="text"
            value={draft.tagline || ''}
            onChange={(e) => updateField('tagline', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
            placeholder="e.g. One Identity, Infinite Possibilities."
          />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Official Website URL</label>
          <input
            type="url"
            value={draft.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
            placeholder="https://onewinq.in"
          />
        </div>
      </div>

      {/* 3 Overview Stats in Header */}
      <div className="pt-3 border-t border-slate-200 space-y-3">
        <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider">Overview Card Stats (3-Column Box)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-600" /> Founded Year
            </label>
            <input
              type="text"
              value={overviewStats.foundedYear || ''}
              onChange={(e) => updateField('overviewStats.foundedYear', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
              placeholder="2024"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-600" /> Location Short
            </label>
            <input
              type="text"
              value={overviewStats.locationShort || ''}
              onChange={(e) => updateField('overviewStats.locationShort', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
              placeholder="Indore"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-purple-600" /> Team Size
            </label>
            <input
              type="text"
              value={overviewStats.teamSize || ''}
              onChange={(e) => updateField('overviewStats.teamSize', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
              placeholder="25+"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
