import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export const StatCard = ({
  icon: Icon,
  iconBg = 'bg-indigo-50 text-indigo-600',
  title,
  value,
  trend,
  trendType = 'up', // 'up', 'down', 'neutral'
  trendSubtext = 'vs last week',
  sparkline
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-card flex flex-col justify-between hover:border-slate-200 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">{value}</h3>
          </div>
        </div>
      </div>

      {(trend !== undefined || trendSubtext || sparkline) && (
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs">
            {trendType === 'up' && (
              <span className="flex items-center text-emerald-600 font-semibold gap-0.5">
                <ArrowUp className="w-3.5 h-3.5" />
                {trend}
              </span>
            )}
            {trendType === 'down' && (
              <span className="flex items-center text-rose-600 font-semibold gap-0.5">
                <ArrowDown className="w-3.5 h-3.5" />
                {trend}
              </span>
            )}
            {trendType === 'neutral' && (
              <span className="flex items-center text-slate-400 font-medium gap-0.5">
                <Minus className="w-3.5 h-3.5" />
                {trend || 'No change'}
              </span>
            )}
            {trendSubtext && <span className="text-slate-400 ml-1">{trendSubtext}</span>}
          </div>

          {sparkline && <div className="w-20 h-6">{sparkline}</div>}
        </div>
      )}
    </div>
  );
};
