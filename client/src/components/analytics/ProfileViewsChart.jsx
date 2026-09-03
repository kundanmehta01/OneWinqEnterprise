import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChevronDown } from 'lucide-react';

export const ProfileViewsChart = ({ trends = [] }) => {
  const defaultData = [
    { date: 'May 18', views: 2050 },
    { date: 'May 19', views: 2450 },
    { date: 'May 20', views: 2750 },
    { date: 'May 21', views: 3550 },
    { date: 'May 22', views: 2780 },
    { date: 'May 23', views: 2790 },
    { date: 'May 24', views: 2320 }
  ];

  const chartData =
    trends && trends.length > 0
      ? trends.map((t) => ({
          date: t.date?.split('-').slice(1).join('/') || t.date,
          views: t.views || 2500
        }))
      : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-lg text-xs">
          <p className="font-semibold">{label}, 2025</p>
          <p className="text-indigo-300 mt-0.5">Views: {payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Profile Views Over Time</h3>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/70 transition cursor-pointer"
        >
          <span>Daily</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}K` : v)}
              domain={[0, 4000]}
              ticks={[0, 1000, 2000, 3000, 4000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#6366F1"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#6366F1', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#6366F1', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
