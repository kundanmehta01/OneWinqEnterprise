import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const DeviceDonutCard = () => {
  const data = [
    { name: 'Mobile', value: 7852, pct: '61.1%', color: '#6366F1' },
    { name: 'Desktop', value: 3642, pct: '28.4%', color: '#0EA5E9' },
    { name: 'Tablet', value: 1348, pct: '10.5%', color: '#10B981' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-900 mb-3">Engagement by Device</h3>

      <div className="flex items-center gap-4 my-auto">
        <div className="relative w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip formatter={(val, name) => [`${val} devices`, name]} />
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

        <div className="space-y-2.5 flex-1 min-w-0">
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
