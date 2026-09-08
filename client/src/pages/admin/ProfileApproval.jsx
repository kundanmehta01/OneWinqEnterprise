import React, { useState } from 'react'
import { useProfileApprovals } from '../../hooks/useAnalytics'

export default function ProfileApproval(){
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState('pending')
  const { data, loading, error } = useProfileApprovals(page, 10, { status: tab })

  if(loading) return <div>Loading...</div>
  if(error) return <div className="text-red-500">Error loading approvals</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="header-title">Profile Approval</h1>
        <p className="text-gray-600">Review and approve or reject profile changes requested by members.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Pending Approvals</div>
          <div className="text-2xl font-semibold">{data?.pending ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Approved</div>
          <div className="text-2xl font-semibold">{data?.approved ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Rejected</div>
          <div className="text-2xl font-semibold">{data?.rejected ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Total Requests</div>
          <div className="text-2xl font-semibold">{data?.total ?? 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border">
        <div className="flex border-b">
          {['Pending', 'Approved', 'Rejected', 'All'].map(t => (
            <button key={t} onClick={() => setTab(t.toLowerCase())} className={`px-4 py-3 border-b-2 ${tab === t.toLowerCase() ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Member</th>
                <th className="text-left py-2">Department</th>
                <th className="text-left py-2">Role</th>
                <th className="text-left py-2">Requested On</th>
                <th className="text-left py-2">Changes</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.items?.map(a => (
                <tr key={a._id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{a.memberName}</td>
                  <td className="py-3">{a.department}</td>
                  <td className="py-3">{a.role}</td>
                  <td className="py-3">{new Date(a.requestedAt).toLocaleDateString()}</td>
                  <td className="py-3">{a.changesCount} changes</td>
                  <td className="py-3"><span className="text-yellow-600">{a.status}</span></td>
                  <td className="py-3"><button className="text-blue-600">View Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
