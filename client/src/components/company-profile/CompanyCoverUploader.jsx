import React from 'react';
import { Image } from 'lucide-react';

export const CompanyCoverUploader = ({ bannerUrl, onUpload }) => {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
        Header Cover / Banner
      </label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-14 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
          {bannerUrl ? (
            <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <Image className="w-6 h-6 text-slate-300" />
          )}
        </div>
        <input
          type="text"
          placeholder="Paste Banner Image URL..."
          value={bannerUrl || ''}
          onChange={(e) => onUpload?.(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800"
        />
      </div>
    </div>
  );
};
