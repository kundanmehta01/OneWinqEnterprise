import React, { useMemo, useState } from 'react'
import { useTeamMembers } from '../../hooks/useTeamMembers'
import TeamMembersTable from '../../components/team-members/TeamMembersTable'
import TeamMembersStats from '../../components/team-members/TeamMembersStats'
import { publicProfileService, teamMemberService } from '../../services'
import ConfirmModal from '../../components/common/ConfirmModal'

export default function TeamMembers() {
  const [page, setPage] = useState(1)
  const [filters] = useState({})
  const { data, loading, error, refetch } = useTeamMembers(page, 10, filters)
  const [selectedMember, setSelectedMember] = useState(null)
  const [editMember, setEditMember] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [qrCode, setQrCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletePending, setDeletePending] = useState(false)

  const stats = useMemo(
    () => ({
      total: data?.pagination?.totalItems || 0,
      active: data?.members?.filter((member) => member.status === 'active').length || 0,
      inactive: data?.members?.filter((member) => member.status !== 'active').length || 0,
      departments: new Set(data?.members?.map((member) => member.departmentId?._id || member.departmentId)).size || 0,
    }),
    [data]
  )

  const handleView = async (member) => {
    setSelectedMember(member)
    const slug = member?.profileId?.slug || member?.slug
    if (!slug) {
      setQrCode('')
      return
    }

    try {
      const response = await publicProfileService.getQrCode(slug)
      const image = typeof response === 'string' ? response : response?.qrCode || response?.data || ''
      setQrCode(image)
    } catch {
      setQrCode('')
    }
  }

  const handleEdit = (member) => {
    setEditMember({
      _id: member._id,
      name: member.name,
      designation: member.designation || '',
    })
  }

  const handleSaveEdit = async () => {
    if (!editMember?._id) return

    try {
      setSaving(true)
      await teamMemberService.update(editMember._id, {
        name: editMember.name,
        designation: editMember.designation,
      })
      setEditMember(null)
      await refetch()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      setDeletePending(true)
      await teamMemberService.delete(deleteTarget._id)
      setDeleteTarget(null)
      await refetch()
    } catch (err) {
      console.error(err)
    } finally {
      setDeletePending(false)
    }
  }

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-600">Loading team members...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">Error loading team members.</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Team Members</h1>
          <p className="text-sm text-slate-600">Manage and organize every member of your organization.</p>
        </div>
        <button type="button" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
          Add Member
        </button>
      </div>

      <TeamMembersStats stats={stats} />

      <TeamMembersTable
        members={data?.members || []}
        pagination={data?.pagination || {}}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        onPageChange={setPage}
      />

      {selectedMember && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{selectedMember.name}</h3>
                <p className="text-sm text-slate-500">{selectedMember.designation || 'Member profile'}</p>
              </div>
              <button type="button" onClick={() => setSelectedMember(null)} className="text-lg text-slate-500">✕</button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[180px,1fr]">
              <div className="rounded-xl border bg-slate-50 p-4">
                {qrCode ? (
                  <img src={qrCode} alt="Member QR code" className="mx-auto h-36 w-36 rounded-lg bg-white p-2" />
                ) : (
                  <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white text-sm text-slate-500">
                    QR unavailable
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex justify-between gap-3 border-b pb-2"><span className="text-slate-500">Department</span><span>{selectedMember.departmentId?.name || '—'}</span></div>
                <div className="flex justify-between gap-3 border-b pb-2"><span className="text-slate-500">Role</span><span>{selectedMember.roleId?.name || '—'}</span></div>
                <div className="flex justify-between gap-3 border-b pb-2"><span className="text-slate-500">Status</span><span>{selectedMember.status || '—'}</span></div>
                <div className="flex justify-between gap-3 border-b pb-2"><span className="text-slate-500">Profile completion</span><span>{selectedMember.profileId?.completionPercentage ?? 0}%</span></div>
                <div className="flex justify-between gap-3 border-b pb-2"><span className="text-slate-500">Employee ID</span><span>{selectedMember.employeeId || '—'}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editMember && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Edit member</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  value={editMember.name}
                  onChange={(event) => setEditMember((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Designation</label>
                <input
                  type="text"
                  value={editMember.designation}
                  onChange={(event) => setEditMember((current) => ({ ...current, designation: event.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setEditMember(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                Cancel
              </button>
              <button type="button" onClick={handleSaveEdit} disabled={saving} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete member"
        message={`Are you sure you want to delete ${deleteTarget?.name || 'this member'}? This will archive the member record and disable the user.`}
        confirmLabel="Delete Member"
        pending={deletePending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
