import React from 'react';
import { Users, UserCheck, Network, Mail, ShieldCheck } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const TeamMembersStats = ({
  totalMembers = 126,
  activeMembers = 118,
  departments = 9,
  pendingInvites = 8,
  adminsCount = 6
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard
        icon={Users}
        iconBg="bg-indigo-50 text-indigo-600"
        title="Total Members"
        value={totalMembers}
        trend="12"
        trendType="up"
        trendSubtext="vs last month"
      />
      <StatCard
        icon={UserCheck}
        iconBg="bg-emerald-50 text-emerald-600"
        title="Active Members"
        value={activeMembers}
        trend="10"
        trendType="up"
        trendSubtext="vs last month"
      />
      <StatCard
        icon={Network}
        iconBg="bg-amber-50 text-amber-600"
        title="Departments"
        value={departments}
        trendType="neutral"
        trendSubtext="No change"
      />
      <StatCard
        icon={Mail}
        iconBg="bg-sky-50 text-sky-600"
        title="Pending Invitations"
        value={pendingInvites}
        trend="4"
        trendType="up"
        trendSubtext="vs last month"
      />
      <StatCard
        icon={ShieldCheck}
        iconBg="bg-purple-50 text-purple-600"
        title="Admins"
        value={adminsCount}
        trendType="neutral"
        trendSubtext="No change"
      />
    </div>
  );
};
