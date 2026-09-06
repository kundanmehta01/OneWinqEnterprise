import React from 'react';

export const RecentDepartmentActivity = ({ activities = [] }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h4>
      {activities.length === 0 ? (
        <p className="text-xs text-slate-400">No recent department updates.</p>
      ) : (
        activities.map((a, idx) => (
          <p key={idx} className="text-xs text-slate-700">{a.message}</p>
        ))
      )}
    </div>
  );
};
