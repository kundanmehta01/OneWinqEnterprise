import React from 'react';
import { Users, Building2, FileText, Trophy, Megaphone } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const DashboardStats = ({ overview = {} }) => {
  const totalMembers = overview.totalMembers ?? 126;
  const departments = overview.totalDepartments ?? 9;
  const activeProfiles = overview.activeMembers ?? 118;
  const achievements = 37;
  const updates = 15;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard
        icon={Users}
        iconBg="bg-indigo-50 text-indigo-600"
        title="Total Members"
        value={totalMembers}
        trend="12"
        trendType="up"
        trendSubtext="vs last week"
      />
      <StatCard
        icon={Building2}
        iconBg="bg-emerald-50 text-emerald-600"
        title="Departments"
        value={departments}
        trend="1"
        trendType="up"
        trendSubtext="vs last week"
      />
      <StatCard
        icon={FileText}
        iconBg="bg-amber-50 text-amber-600"
        title="Active Profiles"
        value={activeProfiles}
        trend="15"
        trendType="up"
        trendSubtext="vs last week"
      />
      <StatCard
        icon={Trophy}
        iconBg="bg-sky-50 text-sky-600"
        title="Achievements"
        value={achievements}
        trend="4"
        trendType="up"
        trendSubtext="vs last week"
      />
      <StatCard
        icon={Megaphone}
        iconBg="bg-purple-50 text-purple-600"
        title="Updates"
        value={updates}
        trend="5"
        trendType="up"
        trendSubtext="vs last week"
      />
    </div>
  );
};
