import React from 'react'

export default function TeamMembersStats({ stats = {} }){
  return (
    <div className="grid grid-cols-5 gap-4">
      <div className="p-4 bg-white rounded-xl border">
        <div className="text-sm text-gray-500">Total Members</div>
        <div className="text-2xl font-semibold">{stats?.total ?? 126}</div>
        <div className="text-xs text-green-600">+12 vs last month</div>
      </div>
      <div className="p-4 bg-white rounded-xl border">
        <div className="text-sm text-gray-500">Active Members</div>
        <div className="text-2xl font-semibold">{stats?.active ?? 118}</div>
        <div className="text-xs text-green-600">+10 vs last month</div>
      </div>
      <div className="p-4 bg-white rounded-xl border">
        <div className="text-sm text-gray-500">Departments</div>
        <div className="text-2xl font-semibold">{stats?.departments ?? 9}</div>
        <div className="text-xs text-gray-500">No change</div>
      </div>
      <div className="p-4 bg-white rounded-xl border">
        <div className="text-sm text-gray-500">Pending Invitations</div>
        <div className="text-2xl font-semibold">{stats?.pendingInvites ?? 8}</div>
        <div className="text-xs text-green-600">+4 vs last month</div>
      </div>
      <div className="p-4 bg-white rounded-xl border">
        <div className="text-sm text-gray-500">Admins</div>
        <div className="text-2xl font-semibold">{stats?.admins ?? 6}</div>
        <div className="text-xs text-gray-500">No change</div>
      </div>
    </div>
  )
}
