import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const KpiCard = ({
  icon: Icon,
  iconBg = 'bg-purple-50 text-purple-600',
  title,
  value,
  trend,
  trendType = 'neutral', // 'up', 'down', 'neutral'
  trendLabel = 'vs last month',
  sparklineData = null,
  sparklineColor = '#6366f1',
  onClick,
  className = ''
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-purple-200 active:scale-[0.99]' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">{value}</h3>
          </div>
        </div>

        {sparklineData && (
          <div className="w-20 h-10 shrink-0">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
              <path
                d={`M 0 ${40 - (sparklineData[0] || 20)} ${sparklineData
                  .map((val, idx) => `L ${(idx / (sparklineData.length - 1)) * 100} ${40 - val}`)
                  .join(' ')}`}
                fill="none"
                stroke={sparklineColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs">
        {trendType === 'up' && (
          <span className="inline-flex items-center font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            {trend}
          </span>
        )}
        {trendType === 'down' && (
          <span className="inline-flex items-center font-semibold text-rose-600">
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            {trend}
          </span>
        )}
        {trendType === 'neutral' && (
          <span className="inline-flex items-center font-medium text-slate-500">
            <Minus className="w-3.5 h-3.5 mr-0.5" />
            {trend || 'No change'}
          </span>
        )}
        {trendLabel && <span className="text-slate-400">{trendLabel}</span>}
      </div>
    </div>
  );
};
