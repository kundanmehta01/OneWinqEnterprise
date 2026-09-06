import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, CreditCard, Network, ShieldAlert } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';

export const RecentActivityList = ({ activities = [] }) => {
  const defaultActivities = [
    {
      id: 1,
      title: 'Company profile was updated',
      author: 'Super Admin',
      time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      icon: Building2,
      iconColor: 'bg-purple-50 text-purple-600'
    },
    {
      id: 2,
      title: '5 new members were added',
      author: 'Priya Sharma',
      time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      icon: Users,
      iconColor: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 3,
      title: 'Template "Founder Profile" was updated',
      author: 'Super Admin',
      time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      icon: CreditCard,
      iconColor: 'bg-amber-50 text-amber-600'
    },
    {
      id: 4,
      title: 'New department "Design Team" was added',
      author: 'Rahul Verma',
      time: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      icon: Network,
      iconColor: 'bg-sky-50 text-sky-600'
    }
  ];

  const displayList =
    activities && activities.length > 0
      ? activities.slice(0, 5).map((act, idx) => ({
          id: act._id || idx,
          title: act.description || `${act.action} on ${act.module}`,
          author: act.actorId?.email?.split('@')[0] || 'Super Admin',
          time: act.timestamp || new Date().toISOString(),
          icon: act.module === 'team' ? Users : act.module === 'departments' ? Network : Building2,
          iconColor: 'bg-indigo-50 text-indigo-600'
        }))
      : defaultActivities;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-900">Recent Activity</h3>
        <Link
          to="/admin/audit-logs"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {displayList.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${item.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">by {item.author}</p>
                </div>
              </div>
              <span className="text-[11px] font-medium text-slate-400 flex-shrink-0">
                {formatRelativeTime(item.time)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
