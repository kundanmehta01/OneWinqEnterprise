import React from 'react'

export default function TeamMembersTable({ members = [], pagination = {} }){
  return (
    <div className="bg-white rounded-xl border">
      <div className="p-6 border-b">
        <input type="text" placeholder="Search members..." className="w-full border rounded px-3 py-2" />
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left py-3 px-4"><input type="checkbox" /></th>
            <th className="text-left py-3 px-4">Member</th>
            <th className="text-left py-3 px-4">Designation</th>
            <th className="text-left py-3 px-4">Department</th>
            <th className="text-left py-3 px-4">Role</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Profile</th>
            <th className="text-left py-3 px-4">Joined</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {members?.map(m => (
            <tr key={m._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3"><input type="checkbox" /></td>
              <td className="px-4 py-3">
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-gray-500">{m.email}</div>
              </td>
              <td className="px-4 py-3">{m.designation || '-'}</td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">{m.department}</span></td>
              <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{m.role}</span></td>
              <td className="px-4 py-3"><span className={`text-xs ${m.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>●</span> {m.status}</td>
              <td className="px-4 py-3">{m.profileCompletion || 0}%</td>
              <td className="px-4 py-3 text-xs text-gray-500">{new Date(m.joinedAt).toLocaleDateString()}</td>
              <td className="px-4 py-3"><button className="text-gray-500">⋯</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 border-t flex justify-between items-center text-sm">
        <div>Showing {members?.length || 0} of {pagination?.total || 0}</div>
        <div className="flex gap-2">
          <button className="px-2 py-1 border rounded hover:bg-gray-50">←</button>
          <button className="px-2 py-1 border rounded bg-purple-600 text-white">1</button>
          <button className="px-2 py-1 border rounded hover:bg-gray-50">→</button>
        </div>
      </div>
    </div>
  )
}
