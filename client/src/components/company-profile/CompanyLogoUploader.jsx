import React from 'react';
import { Upload, Image } from 'lucide-react';

export const CompanyLogoUploader = ({ logoUrl, onUpload }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
        Company Logo
      </label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <Image className="w-6 h-6 text-slate-300" />
          )}
        </div>
        <input
          type="text"
          placeholder="Paste Image URL..."
          value={logoUrl || ''}
          onChange={(e) => onUpload?.(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
        />
      </div>
    </div>
  );
};
