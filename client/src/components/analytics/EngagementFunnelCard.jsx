import React from 'react';
import { formatNumber } from '../../utils/formatNumber';

export const EngagementFunnelCard = () => {
  const steps = [
    { label: 'Profile Views', count: 12842, pct: '100%', barWidth: '100%', color: 'bg-indigo-600' },
    { label: 'Profile Shares', count: 3276, pct: '25.5%', barWidth: '78%', color: 'bg-blue-500' },
    { label: 'Link Clicks', count: 2953, pct: '22.9%', barWidth: '60%', color: 'bg-cyan-500' },
    { label: 'Contact Clicks', count: 1487, pct: '11.6%', barWidth: '44%', color: 'bg-emerald-500' },
    { label: 'Calls / Messages', count: 842, pct: '6.6%', barWidth: '30%', color: 'bg-amber-500' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-900 mb-4">Profile Engagement Funnel</h3>

      <div className="space-y-3.5 my-auto">
        {steps.map((step, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">{step.label}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{formatNumber(step.count)}</span>
                {idx > 0 && <span className="text-[11px] text-slate-400">({step.pct})</span>}
              </div>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
              <div
                className={`h-full rounded-full transition-all duration-500 ${step.color}`}
                style={{ width: step.barWidth }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
