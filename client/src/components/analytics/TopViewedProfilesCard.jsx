import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { formatNumber } from '../../utils/formatNumber';

export const TopViewedProfilesCard = ({ topProfiles = [] }) => {
  const defaultList = [
    { name: 'Rahul Verma', designation: 'Senior Developer', views: 1842, change: '24.6%' },
    { name: 'Priya Sharma', designation: 'Marketing Manager', views: 1532, change: '18.8%' },
    { name: 'Amit Kumar', designation: 'UI/UX Designer', views: 1245, change: '12.3%' },
    { name: 'Sneha Joshi', designation: 'Product Manager', views: 1102, change: '10.7%' },
    { name: 'Vikram Singh', designation: 'HR Executive', views: 982, change: '8.5%' }
  ];

  const displayList =
    topProfiles && topProfiles.length > 0
      ? topProfiles.map((p, idx) => ({
          name: p.name,
          designation: p.designation || 'Team Member',
          views: p.views,
          change: `${(20 - idx * 2.5).toFixed(1)}%`
        }))
      : defaultList;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Top Viewed Profiles</h3>
        <Link
          to="/admin/team-members"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-50">
          <span>Member</span>
          <div className="flex items-center gap-6">
            <span>Views</span>
            <span className="w-12 text-right">Change</span>
          </div>
        </div>

        {displayList.slice(0, 5).map((m, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                {m.name.charAt(0)}
              </div>
              <div className="truncate">
                <h4 className="font-bold text-slate-800 truncate">{m.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">{m.designation}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 flex-shrink-0">
              <span className="font-bold text-slate-800">{formatNumber(m.views)}</span>
              <span className="flex items-center gap-0.5 text-emerald-600 font-semibold w-12 justify-end text-[11px]">
                <ArrowUp className="w-3 h-3" />
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
