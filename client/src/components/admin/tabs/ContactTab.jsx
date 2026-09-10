import React from 'react';
import { MapPin, Mail } from 'lucide-react';
import { useCompanyProfileStore } from '../../../stores/companyProfileStore';

export const ContactTab = () => {
  const { draft, updateField } = useCompanyProfileStore();
  if (!draft) return null;

  const contact = draft.contact || {};
  const location = draft.location || {};

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Contact & Location (Screen 8)</h3>
        <p className="text-xs text-slate-500">Headquarters location, official contact emails, phone, and hours.</p>
      </div>

      {/* Location / Address */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          Head Office Physical Address
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-semibold text-slate-600">Street / Area Address</label>
            <input
              type="text"
              value={location.address || ''}
              onChange={(e) => updateField('location.address', e.target.value)}
              placeholder="Scheme No. 78"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">City</label>
            <input
              type="text"
              value={location.city || ''}
              onChange={(e) => updateField('location.city', e.target.value)}
              placeholder="Indore"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">State / Region</label>
            <input
              type="text"
              value={location.state || ''}
              onChange={(e) => updateField('location.state', e.target.value)}
              placeholder="Madhya Pradesh"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Country</label>
            <input
              type="text"
              value={location.country || ''}
              onChange={(e) => updateField('location.country', e.target.value)}
              placeholder="India"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Postal / Zip Code</label>
            <input
              type="text"
              value={location.zipCode || ''}
              onChange={(e) => updateField('location.zipCode', e.target.value)}
              placeholder="452010"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Official Communication Channels */}
      <div className="pt-3 border-t border-slate-200 space-y-3">
        <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          Official Contact Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Primary Corporate Email</label>
            <input
              type="email"
              value={contact.email || ''}
              onChange={(e) => updateField('contact.email', e.target.value)}
              placeholder="hello@onewinq.in"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Support Email</label>
            <input
              type="email"
              value={contact.supportEmail || ''}
              onChange={(e) => updateField('contact.supportEmail', e.target.value)}
              placeholder="support@onewinq.in"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Official Phone Number</label>
            <input
              type="text"
              value={contact.phone || ''}
              onChange={(e) => updateField('contact.phone', e.target.value)}
              placeholder="+91 731 123 4507"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Working / Operating Hours</label>
            <input
              type="text"
              value={contact.workingHours || ''}
              onChange={(e) => updateField('contact.workingHours', e.target.value)}
              placeholder="Mon - Sat (10 AM - 7 PM)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-semibold text-slate-600">Google Maps Direction URL (Optional)</label>
            <input
              type="url"
              value={contact.directionsUrl || ''}
              onChange={(e) => updateField('contact.directionsUrl', e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
