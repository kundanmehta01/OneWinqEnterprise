import React from 'react';
import { Input } from '../common/Input';
import { Palette } from 'lucide-react';

export const CompanyBranding = ({ branding = {}, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
        <Palette className="w-4 h-4 text-indigo-600" />
        Brand Palette & Styling
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Primary Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={branding.primaryColor || '#6366F1'}
              onChange={(e) => onChange('primaryColor', e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
            />
            <input
              type="text"
              value={branding.primaryColor || '#6366F1'}
              onChange={(e) => onChange('primaryColor', e.target.value)}
              className="w-32 rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Secondary Accent
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={branding.secondaryColor || '#4F46E5'}
              onChange={(e) => onChange('secondaryColor', e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
            />
            <input
              type="text"
              value={branding.secondaryColor || '#4F46E5'}
              onChange={(e) => onChange('secondaryColor', e.target.value)}
              className="w-32 rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
