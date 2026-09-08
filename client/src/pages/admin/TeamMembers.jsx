import React, { useState } from 'react'
import { useTeamMembers } from '../../hooks/useTeamMembers'
import TeamMembersTable from '../../components/team-members/TeamMembersTable'
import TeamMembersStats from '../../components/team-members/TeamMembersStats'

export default function TeamMembers(){
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({})
  const { data, loading, error } = useTeamMembers(page, 10, filters)

  if(loading) return <div>Loading...</div>
  if(error) return <div className="text-red-500">Error loading team members</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="header-title">Team Members</h1>
          <p className="text-gray-600">Manage and organize all members of your organization.</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">Add Member</button>
      </div>

      <TeamMembersStats stats={data?.stats} />
      <TeamMembersTable members={data?.members} pagination={data?.pagination} onPageChange={setPage} />
    </div>
  )
}
