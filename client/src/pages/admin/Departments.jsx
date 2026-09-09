import React, { useEffect, useState } from 'react'
import { departmentService } from '../../services'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [target, setTarget] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const data = await departmentService.getAll({ limit: 100 })
      setDepartments(data || [])
      setError('')
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Unable to load departments.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleDelete = async () => {
    if (!target) return

    try {
      setPendingDelete(true)
      await departmentService.delete(target._id)
      setTarget(null)
      await fetchDepartments()
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Delete failed.')
    } finally {
      setPendingDelete(false)
    }
  }

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-600">Loading departments...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Departments</h1>
          <p className="text-sm text-slate-600">Create and manage departments in your organization.</p>
        </div>
        <button type="button" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
          Create Department
        </button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-medium">Department Name</th>
              <th className="px-4 py-3 font-medium">Members</th>
              <th className="px-4 py-3 font-medium">Head</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-12 text-center text-slate-500">No departments available.</td>
              </tr>
            ) : (
              departments.map((department) => (
                <tr key={department._id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{department.name}</span>
                  </td>
                  <td className="px-4 py-3">{department.memberCount || 0}</td>
                  <td className="px-4 py-3">{department.headMemberId?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-current" />
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setSelectedDepartment(department)} className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100">View</button>
                      <button type="button" className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-100">Edit</button>
                      <button type="button" onClick={() => setTarget(department)} className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50">Delete Department</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedDepartment && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">{selectedDepartment.name}</h3>
              <button type="button" onClick={() => setSelectedDepartment(null)} className="text-slate-500">✕</button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Slug</span><span>{selectedDepartment.slug || '—'}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Members</span><span>{selectedDepartment.memberCount || 0}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Head</span><span>{selectedDepartment.headMemberId?.name || '—'}</span></div>
              <div className="flex justify-between border-b pb-2"><span className="text-slate-500">Description</span><span className="text-right">{selectedDepartment.description || '—'}</span></div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(target)}
        title="Delete department"
        message={`Are you sure you want to delete ${target?.name || 'this department'}? This action will remove the department record.`}
        confirmLabel="Delete Department"
        pending={pendingDelete}
        onClose={() => setTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
