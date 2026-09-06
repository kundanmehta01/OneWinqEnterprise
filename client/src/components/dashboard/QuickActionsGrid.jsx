import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Network, CreditCard, CheckCircle2, Send } from 'lucide-react';

export const QuickActionsGrid = () => {
  const actions = [
    {
      title: 'Company Profile',
      desc: 'Manage company information',
      icon: Building2,
      path: '/admin/company-profile',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Team Members',
      desc: 'View and manage members',
      icon: Users,
      path: '/admin/team-members',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Departments',
      desc: 'Create and manage departments',
      icon: Network,
      path: '/admin/departments',
      color: 'bg-sky-50 text-sky-600'
    },
    {
      title: 'Templates',
      desc: 'Manage profile templates',
      icon: CreditCard,
      path: '/admin/templates',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      title: 'Profile Approval',
      desc: 'Review and approve profiles',
      icon: CheckCircle2,
      path: '/admin/profile-approvals',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      title: 'Invitations',
      desc: 'Invite new members to join',
      icon: Send,
      path: '/admin/invitations',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card">
      <h3 className="text-base font-bold text-slate-900 mb-5">Quick Actions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              to={act.path}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200 transition-all duration-200 group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${act.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {act.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{act.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
