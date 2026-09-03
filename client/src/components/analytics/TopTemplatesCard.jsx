import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { formatNumber } from '../../utils/formatNumber';

export const TopTemplatesCard = () => {
  const templates = [
    { name: 'Executive Profile', views: 4328, usage: 24, change: '22.3%' },
    { name: 'Manager Profile', views: 3782, usage: 38, change: '18.6%' },
    { name: 'Employee Profile', views: 2940, usage: 142, change: '15.8%' },
    { name: 'Founder Profile', views: 1792, usage: 15, change: '10.2%' },
    { name: 'Company Profile', views: 1245, usage: 1, change: '8.7%' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-slate-900">Top Performing Templates</h3>
        <Link
          to="/admin/templates"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
          <span>Template</span>
          <div className="flex items-center gap-5">
            <span>Views</span>
            <span>Usage</span>
            <span className="w-12 text-right">Change</span>
          </div>
        </div>

        {templates.map((t, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-5 rounded bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 flex-shrink-0">
                T
              </div>
              <h4 className="font-bold text-slate-800 truncate">{t.name}</h4>
            </div>

            <div className="flex items-center gap-5 flex-shrink-0">
              <span className="font-semibold text-slate-700">{formatNumber(t.views)}</span>
              <span className="text-slate-500 font-medium min-w-[20px] text-center">{t.usage}</span>
              <span className="flex items-center gap-0.5 text-emerald-600 font-semibold w-12 justify-end text-[11px]">
                <ArrowUp className="w-3 h-3" />
                {t.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
