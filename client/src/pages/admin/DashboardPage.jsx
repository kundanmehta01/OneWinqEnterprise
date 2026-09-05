import React, { useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { useAuth } from '../../hooks/useAuth';
import { useAnalytics } from '../../hooks/useAnalytics';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { MembersGrowthChart } from '../../components/dashboard/MembersGrowthChart';
import { ProfileCompletionDonut } from '../../components/dashboard/ProfileCompletionDonut';
import { RecentActivityList } from '../../components/dashboard/RecentActivityList';
import { QuickActionsGrid } from '../../components/dashboard/QuickActionsGrid';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const DashboardPage = () => {
  const { dashboardData, loading, error } = useDashboard();
  const { members } = useTeamMembers({ limit: 100 });
  const { member } = useAuth();
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30d');
  const [analyticsDates, setAnalyticsDates] = useState({ startDate: '', endDate: '' });
  const { analytics: analyticsData, loading: analyticsLoading, error: analyticsError } = useAnalytics(analyticsPeriod, analyticsDates);

  if (loading && !dashboardData) {
    return (
      <div className="py-24">
        <LoadingSpinner message="Loading dashboard intelligence..." />
      </div>
    );
  }

  if (error && !dashboardData) {
    return <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>;
  }

  const overview = dashboardData?.overview || {};
  const trends = Array.isArray(analyticsData?.trends) ? analyticsData.trends : Array.isArray(dashboardData?.analyticsTrends)
    ? dashboardData.analyticsTrends
    : Array.isArray(dashboardData?.analytics?.memberGrowth)
      ? dashboardData.analytics.memberGrowth
      : Array.isArray(dashboardData?.analytics?.trends)
        ? dashboardData.analytics.trends
        : Array.isArray(dashboardData?.memberGrowth)
          ? dashboardData.memberGrowth
          : [];
  const recentActivity = dashboardData?.recentActivity || [];
  const completionMembers = members.filter((member) => member.status !== 'archived');
  const completedProfiles = completionMembers.filter((member) => Number(member.profileCompletionScore ?? member.profileId?.completionPercentage ?? 0) >= 100).length;
  const pendingReviewProfiles = completionMembers.filter((member) => ['pending_review', 'changes_requested'].includes(member.profileId?.approvalStatus)).length;
  const inProgressProfiles = Math.max(0, completionMembers.length - completedProfiles - pendingReviewProfiles);
  const completionOverview = {
    ...overview,
    completionPercentage: Number(overview.averageProfileCompletion ?? 0),
    completedProfiles,
    pendingReviewProfiles: Math.max(pendingReviewProfiles, Number(overview.pendingApprovalsCount ?? 0)),
    inProgressProfiles
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <DashboardHeader userName={member?.name || 'Super Admin'} />

      {/* Row 1: 5 KPI Summary Cards */}
      <DashboardStats overview={overview} />

      {/* Row 2: Members Growth & Profile Completion Charts */}
      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <label className="text-xs font-semibold text-slate-600">Analytics period
          <select value={analyticsPeriod} onChange={(event) => setAnalyticsPeriod(event.target.value)} className="ml-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium">
            <option value="7d">Last 7 days</option><option value="30d">This month</option><option value="90d">Last 3 months</option><option value="custom">Custom range</option>
          </select>
        </label>
        {analyticsPeriod === 'custom' && <><label className="text-xs font-semibold text-slate-600">From<input type="date" value={analyticsDates.startDate} onChange={(event) => setAnalyticsDates((current) => ({ ...current, startDate: event.target.value }))} className="ml-2 rounded-lg border border-slate-200 px-2 py-2 text-xs" /></label><label className="text-xs font-semibold text-slate-600">To<input type="date" value={analyticsDates.endDate} onChange={(event) => setAnalyticsDates((current) => ({ ...current, endDate: event.target.value }))} className="ml-2 rounded-lg border border-slate-200 px-2 py-2 text-xs" /></label></>}
        {analyticsError && <span className="text-xs text-rose-600">{analyticsError}</span>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 min-w-0">
          <MembersGrowthChart trends={trends} period={analyticsPeriod} onPeriodChange={setAnalyticsPeriod} loading={analyticsLoading} />
        </div>
        <div className="lg:col-span-5">
          <ProfileCompletionDonut overview={completionOverview} />
        </div>
      </div>

      {/* Row 3: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <RecentActivityList activities={recentActivity} />
        </div>
        <div className="lg:col-span-7">
          <QuickActionsGrid />
        </div>
      </div>
    </div>
  );
};
