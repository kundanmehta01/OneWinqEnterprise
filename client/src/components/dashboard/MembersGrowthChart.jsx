import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChevronDown } from 'lucide-react';

export const MembersGrowthChart = ({ trends = [] }) => {
  const rawTrends = Array.isArray(trends)
    ? trends
    : trends && typeof trends === 'object'
      ? Object.entries(trends).map(([date, value]) => ({ date, value }))
      : [];
  const chartData = rawTrends
    .map((trend) => ({
      date: trend.date || trend.label || trend.period || trend.month || trend.createdAt,
      members: Number(trend.totalMembers ?? trend.memberCount ?? trend.members ?? trend.count ?? trend.value ?? trend.newMembers ?? 0)
    }))
    .filter((point) => point.date && Number.isFinite(point.members));
  const maxMembers = Math.max(...chartData.map((point) => point.members), 0);
  const yMax = Math.max(10, Math.ceil(maxMembers / 10) * 10);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-lg text-xs">
          <p className="font-semibold">{label}</p>
          <div className="flex items-center gap-1.5 mt-1 text-indigo-300">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Total Members: {payload[0].value}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card min-w-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Members Growth</h3>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/70 transition cursor-pointer"
        >
          <span>This Month</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      <div className="h-64 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-400">No member growth data is available yet.</div>
        ) : (
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              domain={[0, yMax]}
              allowDecimals={false}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="members"
              stroke="#6366F1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#growthGradient)"
              activeDot={{ r: 6, fill: '#6366F1', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
