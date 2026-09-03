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

  const overview = dashboardData?.overview || {};
  const trends = dashboardData?.analyticsTrends || [];
  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <DashboardHeader userName={member?.name || 'Super Admin'} />

      {/* Row 1: 5 KPI Summary Cards */}
      <DashboardStats overview={overview} />

      {/* Row 2: Members Growth & Profile Completion Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
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
