import React, { useState, useEffect } from 'react'
import { departmentService } from '../../services'

export default function Departments(){
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await departmentService.getAll({ limit: 50 })
        setDepartments(data.departments || data.items || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if(loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="header-title">Departments</h1>
          <p className="text-gray-600">Create and manage departments in your organization.</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">Create Department</button>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Department Name</th>
              <th className="text-left py-3">Members</th>
              <th className="text-left py-3">Head</th>
              <th className="text-left py-3">Status</th>
              <th className="text-left py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(d => (
              <tr key={d._id} className="border-b hover:bg-gray-50">
                <td className="py-3"><span className="px-3 py-1 bg-blue-100 rounded text-blue-800 text-sm">{d.name}</span></td>
                <td className="py-3">{d.memberCount || 0}</td>
                <td className="py-3">{d.head?.name || '-'}</td>
                <td className="py-3"><span className="text-green-600">●</span> Active</td>
                <td className="py-3"><button className="text-gray-500">⋯</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
