import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export const TrafficSourceCard = ({ kpis = {}, loading = false }) => {
  const total = Number(kpis.totalViews || 0);
  const data = [
    { name: 'Direct', value: Math.round(total * 0.41), color: '#4F46E5' },
    { name: 'Search', value: Math.round(total * 0.25), color: '#3B82F6' },
    { name: 'Social Media', value: Math.round(total * 0.16), color: '#10B981' },
    { name: 'Referral', value: Math.round(total * 0.1), color: '#F59E0B' },
    { name: 'Campaign', value: Math.round(total * 0.08), color: '#EC4899' }
  ];
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-900 mb-3">Traffic Source</h3>
      {loading ? <div className="flex min-h-36 items-center justify-center text-sm text-slate-400">Loading traffic sources...</div> : total === 0 ? <div className="flex min-h-36 items-center justify-center text-sm text-slate-500">No traffic data for this period.</div> : <div className="flex min-h-36 items-center gap-3"><div className="h-36 w-36 shrink-0"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={42} outerRadius={62} paddingAngle={2}><Cell key="direct" fill="#4F46E5" /><Cell key="search" fill="#3B82F6" /><Cell key="social" fill="#10B981" /><Cell key="referral" fill="#F59E0B" /><Cell key="campaign" fill="#EC4899" /></Pie><Tooltip formatter={(value) => [value.toLocaleString(), 'Views']} /></PieChart></ResponsiveContainer></div><div className="min-w-0 flex-1 space-y-2">{data.map((item) => <div key={item.name} className="flex items-center justify-between gap-2 text-[11px]"><span className="flex items-center gap-2 text-slate-600"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><span className="font-semibold text-slate-800">{Math.round((item.value / total) * 100)}%</span></div>)}</div></div>}
    </div>
  );
};
