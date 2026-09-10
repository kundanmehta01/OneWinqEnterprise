import React from 'react';
import { Users, Building2, UserCheck, CheckCircle2, Send } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const DashboardStats = ({ overview = {} }) => {
  const totalMembers = overview.totalMembers ?? 0;
  const activeMembers = overview.activeMembers ?? 0;
  const departments = overview.totalDepartments ?? 0;
  const pendingApprovals = overview.pendingReviewProfiles ?? overview.pendingApprovalsCount ?? 0;
  const pendingInvites = overview.pendingInvites ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard
        icon={Users}
        iconBg="bg-indigo-50 text-indigo-600"
        title="Total Members"
        value={totalMembers}
        trendType="neutral"
        trendSubtext="Organization directory"
      />
      <StatCard
        icon={UserCheck}
        iconBg="bg-emerald-50 text-emerald-600"
        title="Active Members"
        value={activeMembers}
        trendType="neutral"
        trendSubtext="Active team accounts"
      />
      <StatCard
        icon={Building2}
        iconBg="bg-sky-50 text-sky-600"
        title="Departments"
        value={departments}
        trendType="neutral"
        trendSubtext="Functional units"
      />
      <StatCard
        icon={CheckCircle2}
        iconBg="bg-amber-50 text-amber-600"
        title="Pending Approvals"
        value={pendingApprovals}
        trendType={pendingApprovals > 0 ? 'up' : 'neutral'}
        trendSubtext="Awaiting review"
      />
      <StatCard
        icon={Send}
        iconBg="bg-purple-50 text-purple-600"
        title="Pending Invites"
        value={pendingInvites}
        trendType="neutral"
        trendSubtext="Dispatched onboarding"
      />
    </div>
  );
};
