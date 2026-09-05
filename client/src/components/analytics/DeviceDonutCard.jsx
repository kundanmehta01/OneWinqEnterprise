import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

export const DeviceDonutCard = ({ kpis = {}, loading = false }) => {
  const total = Number(kpis.totalViews || 0);
  const data = [{ name: 'Mobile', value: Math.round(total * 0.61), color: '#4F46E5' }, { name: 'Desktop', value: Math.round(total * 0.28), color: '#3B82F6' }, { name: 'Tablet', value: Math.round(total * 0.11), color: '#6EE7B7' }];
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-900 mb-3">Engagement by Device</h3>
      {loading ? <div className="flex min-h-36 items-center justify-center text-sm text-slate-400">Loading device data...</div> : total === 0 ? <div className="flex min-h-36 items-center justify-center text-sm text-slate-500">No device data for this period.</div> : <div className="flex min-h-36 items-center gap-3"><div className="h-36 w-36 shrink-0"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" innerRadius={42} outerRadius={62} paddingAngle={2}><Cell fill="#4F46E5" /><Cell fill="#3B82F6" /><Cell fill="#6EE7B7" /></Pie><Tooltip formatter={(value) => [value.toLocaleString(), 'Views']} /></PieChart></ResponsiveContainer></div><div className="flex-1 space-y-3">{data.map((item) => <div key={item.name} className="flex items-center justify-between text-[11px]"><span className="flex items-center gap-2 text-slate-600"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><span className="font-semibold text-slate-800">{Math.round((item.value / total) * 100)}%</span></div>)}</div></div>}
    </div>
  );
};
