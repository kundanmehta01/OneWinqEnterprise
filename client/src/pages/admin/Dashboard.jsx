import React from 'react'
import useDashboard from '../../hooks/useDashboard'
import StatsGrid from '../../components/dashboard/StatsGrid'
import MembersGrowthChart from '../../components/dashboard/MembersGrowthChart'
import ProfileCompletionDonut from '../../components/dashboard/ProfileCompletionDonut'
import RecentActivity from '../../components/dashboard/RecentActivity'
import QuickActions from '../../components/dashboard/QuickActions'

export default function Dashboard(){
  const { data, loading, error } = useDashboard()

  if(loading) return <div>Loading dashboard...</div>
  if(error) return <div className="text-red-500">Error loading dashboard</div>

  const overview = data?.overview
  const trends = data?.analyticsTrends
  const completion = { completed: data?.overview?.averageProfileCompletion, inProgress: 20, pending: 10 }

  return (
    <div className="space-y-6">
      <StatsGrid overview={overview} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-4 bg-white rounded-xl border">
          <div className="header-title">Members Growth</div>
          <div className="mt-4">
            <MembersGrowthChart trends={trends} />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border">
          <div className="header-title">Profile Completion Overview</div>
          <div className="mt-4">
            <ProfileCompletionDonut completion={completion} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-4 bg-white rounded-xl border">
          <div className="header-title">Recent Activity</div>
          <div className="mt-4">
            <RecentActivity items={data?.recentActivity} />
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border">
          <div className="header-title">Quick Actions</div>
          <div className="mt-4">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
