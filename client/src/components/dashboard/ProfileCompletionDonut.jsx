import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const ProfileCompletionDonut = ({ overview = {} }) => {
  const total = overview.totalMembers ?? 0;
  const completed = overview.activeMembers ?? 0;
  const pending = overview.pendingApprovalsCount ?? 0;
  const inProgress = Math.max(0, total - completed - pending);
  const displayTotal = total > 0 ? total : 1;

  const data = [
    { name: 'Completed', value: completed, color: '#6366F1' },
    { name: 'In Progress', value: inProgress, color: '#F59E0B' },
    { name: 'Pending Review', value: pending, color: '#38BDF8' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-900 mb-2">Profile Completion Overview</h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
        {/* Donut Chart with Center Text */}
        <div className="relative w-44 h-44 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val, name) => [`${val} (${Math.round((val / displayTotal) * 100)}%)`, name]}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{completed}</span>
            <span className="text-[11px] font-semibold text-slate-400">Completed</span>
          </div>
        </div>

        {/* Breakdown Legend */}
        <div className="space-y-3.5 flex-1 w-full sm:w-auto">
          {data.map((item) => {
            const pct = Math.round((item.value / displayTotal) * 100);
            return (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
                <span className="text-slate-500 font-medium">
                  {item.value} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
        <span>Total Profiles</span>
        <span className="font-bold text-slate-800">{total}</span>
      </div>
    </div>
  );
};
