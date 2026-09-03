import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const TrafficSourceCard = () => {
  const data = [
    { name: 'Direct', value: 5264, pct: '41.0%', color: '#4338CA' },
    { name: 'QR Code', value: 3312, pct: '25.8%', color: '#8B5CF6' },
    { name: 'OneWinq Search', value: 2214, pct: '17.2%', color: '#10B981' },
    { name: 'Social Media', value: 1256, pct: '9.8%', color: '#F43F5E' },
    { name: 'Other', value: 796, pct: '6.2%', color: '#F59E0B' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-900 mb-3">Traffic Source</h3>

      <div className="flex items-center gap-4 my-auto">
        {/* Donut Chart */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip formatter={(val, name) => [`${val} views`, name]} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-sm font-black text-slate-900 leading-tight">12,842</span>
            <span className="text-[10px] text-slate-400 font-medium">Total Views</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 flex-1 min-w-0">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-slate-700 truncate">{item.name}</span>
              </div>
              <span className="text-slate-400 font-semibold ml-2">
                {item.value.toLocaleString()} ({item.pct})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
