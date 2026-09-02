import React, { useState } from 'react'
import { useRoles } from '../../hooks/useRoles'

export default function RolesPermissions(){
  const [page, setPage] = useState(1)
  const { data, loading, error } = useRoles(page, 10)
  const [selectedRole, setSelectedRole] = useState(null)

  if(loading) return <div>Loading...</div>
  if(error) return <div className="text-red-500">Error loading roles</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="header-title">Roles & Permissions</h1>
          <p className="text-gray-600">Manage user roles and their access permissions across the platform.</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">Create Role</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Total Roles</div>
          <div className="text-2xl font-semibold">{data?.total ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Active Roles</div>
          <div className="text-2xl font-semibold">{data?.active ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Inactive Roles</div>
          <div className="text-2xl font-semibold">{data?.inactive ?? 0}</div>
        </div>
        <div className="p-4 bg-white rounded-xl border">
          <div className="text-sm text-gray-500">Custom Roles</div>
          <div className="text-2xl font-semibold">{data?.custom ?? 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Roles</h3>
          <div className="space-y-2">
            {data?.roles?.map(r => (
              <button key={r._id} onClick={() => setSelectedRole(r)} className={`w-full text-left p-3 rounded border ${selectedRole?._id === r._id ? 'bg-purple-100 border-purple-500' : 'hover:bg-gray-50'}`}>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-gray-500">{r.users} users</div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-xl border p-6">
          {selectedRole ? (
            <div>
              <h3 className="font-semibold mb-4">Module Permissions - {selectedRole.name}</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Module</th>
                    <th className="text-center py-2">View</th>
                    <th className="text-center py-2">Create</th>
                    <th className="text-center py-2">Edit</th>
                    <th className="text-center py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRole.permissions?.map((p, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{p.module}</td>
                      <td className="text-center"><input type="checkbox" checked={p.view} readOnly /></td>
                      <td className="text-center"><input type="checkbox" checked={p.create} readOnly /></td>
                      <td className="text-center"><input type="checkbox" checked={p.edit} readOnly /></td>
                      <td className="text-center"><input type="checkbox" checked={p.delete} readOnly /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">Select a role to view permissions</div>
          )}
        </div>
      </div>
    </div>
  )
}
