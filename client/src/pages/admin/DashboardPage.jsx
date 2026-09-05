import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../hooks/useAuth';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DashboardStats } from '../../components/dashboard/DashboardStats';
import { MembersGrowthChart } from '../../components/dashboard/MembersGrowthChart';
import { ProfileCompletionDonut } from '../../components/dashboard/ProfileCompletionDonut';
import { RecentActivityList } from '../../components/dashboard/RecentActivityList';
import { QuickActionsGrid } from '../../components/dashboard/QuickActionsGrid';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const DashboardPage = () => {
  const { dashboardData, loading, error } = useDashboard();
  const { member } = useAuth();

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
  const trends = Array.isArray(dashboardData?.analyticsTrends)
    ? dashboardData.analyticsTrends
    : Array.isArray(dashboardData?.analytics?.memberGrowth)
      ? dashboardData.analytics.memberGrowth
      : Array.isArray(dashboardData?.analytics?.trends)
        ? dashboardData.analytics.trends
        : Array.isArray(dashboardData?.memberGrowth)
          ? dashboardData.memberGrowth
          : [];
  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <DashboardHeader userName={member?.name || 'Super Admin'} />

      {/* Row 1: 5 KPI Summary Cards */}
      <DashboardStats overview={overview} />

      {/* Row 2: Members Growth & Profile Completion Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 min-w-0">
          <MembersGrowthChart trends={trends} />
        </div>
        <div className="lg:col-span-5">
          <ProfileCompletionDonut overview={overview} />
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
