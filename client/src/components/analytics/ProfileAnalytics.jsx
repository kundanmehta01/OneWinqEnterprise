import React from 'react';
import { Eye, Users, MousePointerClick, Download } from 'lucide-react';

export const ProfileAnalytics = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl border border-slate-100">
        <span className="text-[11px] text-slate-400 font-bold uppercase">Total Views</span>
        <h4 className="text-xl font-black text-slate-900 mt-1">{stats.totalViews || '14,250'}</h4>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-100">
        <span className="text-[11px] text-slate-400 font-bold uppercase">Unique Visitors</span>
        <h4 className="text-xl font-black text-slate-900 mt-1">{stats.uniqueVisitors || '8,120'}</h4>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-100">
        <span className="text-[11px] text-slate-400 font-bold uppercase">vCard Saves</span>
        <h4 className="text-xl font-black text-slate-900 mt-1">{stats.vcardDownloads || '3,410'}</h4>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-100">
        <span className="text-[11px] text-slate-400 font-bold uppercase">QR Scans</span>
        <h4 className="text-xl font-black text-slate-900 mt-1">{stats.qrScans || '1,890'}</h4>
      </div>
    </div>
  );
};
