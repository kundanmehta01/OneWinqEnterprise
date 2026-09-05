import React, { useState } from 'react'
import { useProfileApprovals } from '../../hooks/useAnalytics'
import { profileApprovalService } from '../../services'

const tabs = [
  { value: 'pending', label: 'Pending' },
  { value: 'changes_requested', label: 'Changes requested' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'all', label: 'All' },
]

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
  changes_requested: 'bg-sky-100 text-sky-700',
}

export default function ProfileApproval() {
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState('pending')
  const { data, loading, error, refetch } = useProfileApprovals(page, 10, tab === 'all' ? {} : { status: tab })

  const handleReview = async (id, status) => {
    try {
      await profileApprovalService.review(id, { status, reviewNote: status === 'approved' ? 'Approved by admin' : status === 'rejected' ? 'Rejected by admin' : 'Changes requested by admin' })
      await refetch()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-600">Loading approvals...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">Error loading approvals.</div>

  const items = data?.items || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Profile Approval</h1>
        <p className="text-sm text-slate-600">Review submitted profile updates and handle approval states from the backend.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4"><div className="text-sm text-slate-500">Pending</div><div className="mt-2 text-3xl font-semibold text-slate-900">{data?.pending ?? 0}</div></div>
        <div className="rounded-xl border bg-white p-4"><div className="text-sm text-slate-500">Approved</div><div className="mt-2 text-3xl font-semibold text-slate-900">{data?.approved ?? 0}</div></div>
        <div className="rounded-xl border bg-white p-4"><div className="text-sm text-slate-500">Rejected</div><div className="mt-2 text-3xl font-semibold text-slate-900">{data?.rejected ?? 0}</div></div>
        <div className="rounded-xl border bg-white p-4"><div className="text-sm text-slate-500">Total</div><div className="mt-2 text-3xl font-semibold text-slate-900">{data?.total ?? 0}</div></div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap border-b bg-slate-50">
          {tabs.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => { setTab(item.value); setPage(1) }}
              className={`px-4 py-3 text-sm font-medium ${tab === item.value ? 'border-b-2 border-violet-600 text-violet-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Department</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-4 py-3 font-medium">Changes</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-500">No approval requests match this status.</td>
                </tr>
              ) : (
                items.map((approval) => (
                  <tr key={approval._id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{approval.memberId?.name || approval.memberName || 'Member'}</div>
                    </td>
                    <td className="px-4 py-3">{approval.memberId?.departmentId?.name || approval.department || '—'}</td>
                    <td className="px-4 py-3">{approval.memberId?.roleId?.name || approval.role || '—'}</td>
                    <td className="px-4 py-3">{approval.submittedAt ? new Date(approval.submittedAt).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3">{approval.diffSummary?.length || approval.changesCount || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusStyles[approval.status] || 'bg-slate-100 text-slate-700'}`}>
                        {approval.status === 'changes_requested' ? 'Changes requested' : approval.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {approval.status !== 'approved' && (
                          <button type="button" onClick={() => handleReview(approval._id, 'approved')} className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100">Approve</button>
                        )}
                        {approval.status !== 'rejected' && (
                          <button type="button" onClick={() => handleReview(approval._id, 'rejected')} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100">Reject</button>
                        )}
                        {approval.status !== 'changes_requested' && (
                          <button type="button" onClick={() => handleReview(approval._id, 'changes_requested')} className="rounded border border-sky-200 bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 hover:bg-sky-100">Request changes</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
