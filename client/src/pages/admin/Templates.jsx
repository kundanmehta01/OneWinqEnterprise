import React, { useState } from 'react'
import { useTemplates } from '../../hooks/useTemplates'

export default function Templates(){
  const [page, setPage] = useState(1)
  const { data, loading, error } = useTemplates(page, 10)

  if(loading) return <div>Loading...</div>
  if(error) return <div className="text-red-500">Error loading templates</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="header-title">Templates</h1>
          <p className="text-gray-600">Create, manage and assign profile templates for your organization.</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">Create Template</button>
      </div>

      <div className="grid grid-cols-5 gap-4 bg-white p-4 rounded-xl border">
        <div>
          <div className="text-sm text-gray-500">Total Templates</div>
          <div className="text-2xl font-semibold">{data?.total ?? 0}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-semibold">{data?.active ?? 0}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Inactive</div>
          <div className="text-2xl font-semibold">{data?.inactive ?? 0}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Assigned</div>
          <div className="text-2xl font-semibold">{data?.assigned ?? 0}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Total Usage</div>
          <div className="text-2xl font-semibold">{data?.totalUsage ?? 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Template Name</th>
              <th className="text-left py-2">Category</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Assigned To</th>
              <th className="text-left py-2">Usage</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.templates?.map(t => (
              <tr key={t._id} className="border-b hover:bg-gray-50">
                <td className="py-3">{t.name}</td>
                <td className="py-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{t.category}</span></td>
                <td className="py-3">{t.type}</td>
                <td className="py-3">{t.assignedCount ?? 0} members</td>
                <td className="py-3">{t.usageCount ?? 0}</td>
                <td className="py-3"><span className="text-green-600">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
