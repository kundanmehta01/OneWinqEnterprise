import React from 'react';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const RolesStats = ({
  totalRoles = 6,
  activeRoles = 5,
  inactiveRoles = 1,
  customRoles = 3
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={Users}
        iconBg="bg-indigo-50 text-indigo-600"
        title="Total Roles"
        value={totalRoles}
        trendType="neutral"
        trendSubtext="No change"
      />
      <StatCard
        icon={UserCheck}
        iconBg="bg-emerald-50 text-emerald-600"
        title="Active Roles"
        value={activeRoles}
        trend="1"
        trendType="up"
        trendSubtext="vs last month"
      />
      <StatCard
        icon={UserX}
        iconBg="bg-amber-50 text-amber-600"
        title="Inactive Roles"
        value={inactiveRoles}
        trendType="neutral"
        trendSubtext="No change"
      />
      <StatCard
        icon={Shield}
        iconBg="bg-sky-50 text-sky-600"
        title="Custom Roles"
        value={customRoles}
        trend="1"
        trendType="up"
        trendSubtext="vs last month"
      />
    </div>
  );
};
