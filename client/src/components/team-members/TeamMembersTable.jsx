import React, { useMemo, useState } from 'react'

export function TeamMembersTable({
  members = [],
  pagination = {},
  onView,
  onEdit,
  onDelete,
  onPageChange,
  selectedIds = [],
  onSelect,
  onSelectAll,
}) {
  const [menuOpenId, setMenuOpenId] = useState(null)

  const currentPage = Number(pagination.currentPage || 1)
  const totalPages = Number(pagination.totalPages || 1)
  const allSelected = members.length > 0 && members.every((member) => selectedIds.includes(member._id))

  const menuNote = useMemo(
    () => ({
      view: 'View',
      edit: 'Edit',
      delete: 'Delete Member',
    }),
    []
  )

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b bg-slate-50 p-4">
        <input
          type="text"
          readOnly
          placeholder="Search members..."
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-medium">
                <input
                  type="checkbox"
                  aria-label="Select all members"
                  checked={allSelected}
                  onChange={(event) => onSelectAll?.(event.target.checked)}
                />
              </th>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Designation</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Profile</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                  No team members found.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member._id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Select ${member.name}`}
                      checked={selectedIds.includes(member._id)}
                      onChange={(event) => onSelect?.(member._id, event.target.checked)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-indigo-100 text-center text-sm font-bold leading-9 text-indigo-700">
                        {member.profileId?.published?.avatarUrl ? <img src={member.profileId.published.avatarUrl} alt={member.name} className="h-full w-full object-cover" /> : member.name?.charAt(0) || 'M'}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-900">{member.name}</div>
                    <div className="text-xs text-slate-500">{member.userId?.email || member.email || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{member.designation || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {member.departmentId?.name || member.department || 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700">
                      {member.roleId?.name || member.role || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${member.status === 'active' ? 'bg-emerald-50 text-emerald-600' : member.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {member.status || 'inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{member.profileId?.completionPercentage ?? member.profileCompletion ?? 0}%</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {member.joiningDate ? new Date(member.joiningDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative flex justify-end">
                      <button
                        type="button"
                        onClick={() => setMenuOpenId(menuOpenId === member._id ? null : member._id)}
                        className="rounded-md border border-slate-200 px-2 py-1 text-lg text-slate-600 hover:bg-slate-100"
                        aria-label="Open actions"
                      >
                        ⋯
                      </button>

                      {menuOpenId === member._id && (
                        <div className="absolute right-0 top-10 z-10 w-40 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpenId(null)
                              onView?.(member)
                            }}
                            className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100"
                          >
                            {menuNote.view}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpenId(null)
                              onEdit?.(member)
                            }}
                            className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-slate-100"
                          >
                            {menuNote.edit}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpenId(null)
                              onDelete?.(member)
                            }}
                            className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            {menuNote.delete}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <div>
          Showing {members.length} of {pagination.totalItems || members.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="rounded border border-slate-200 bg-white px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ←
          </button>
          <span className="rounded border border-violet-600 bg-violet-600 px-2 py-1 text-white">{currentPage}</span>
          <button
            type="button"
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="rounded border border-slate-200 bg-white px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeamMembersTable
