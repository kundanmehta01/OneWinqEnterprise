import React from 'react'

function StatCard({title, value, note}){
  return (
    <div className="p-4 bg-white rounded-xl border">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {note && <div className="text-sm text-green-500">{note}</div>}
    </div>
  )
}

export default function StatsGrid({overview}){
  if(!overview) return null
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Members" value={overview.totalMembers ?? '-'} note={`+${overview.totalMembersChange ?? 0} vs last week`} />
      <StatCard title="Departments" value={overview.totalDepartments ?? '-'} note={`+${overview.departmentsChange ?? 0} vs last week`} />
      <StatCard title="Active Profiles" value={overview.activeMembers ?? '-'} note={`+${overview.activeChange ?? 0} vs last week`} />
      <StatCard title="Achievements" value={overview.achievements ?? '-'} note={`+${overview.achievementsChange ?? 0} vs last week`} />
    </div>
  )
}
