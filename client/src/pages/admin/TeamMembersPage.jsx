import React, { useState } from 'react';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { useDepartments } from '../../hooks/useDepartments';
import { useRoles } from '../../hooks/useRoles';
import { TeamMembersHeader } from '../../components/team-members/TeamMembersHeader';
import { TeamMembersStats } from '../../components/team-members/TeamMembersStats';
import { TeamMembersFilters } from '../../components/team-members/TeamMembersFilters';
import { TeamMembersTable } from '../../components/team-members/TeamMembersTable';
import { EditMemberModal } from '../../components/team-members/EditMemberModal';
import { MemberDetailsModal } from '../../components/team-members/MemberDetailsModal';
import { AddMemberModal } from '../../components/team-members/AddMemberModal';
import { InviteMemberModal } from '../../components/team-members/InviteMemberModal';
import { Pagination } from '../../components/common/Pagination';
import { teamMemberService } from '../../services/teamMemberService';
import { useNotification } from '../../hooks/useNotification';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const TeamMembersPage = () => {
  const {
    members,
    pagination,
    params,
    loading,
    updateFilters,
    changePage,
    changeLimit,
    refetch
  } = useTeamMembers();

  const { departments } = useDepartments();
  const { roles } = useRoles();
  const { success, error: notifyError } = useNotification();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [detailsMember, setDetailsMember] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleDeleteSelected = async () => {
    setDeleteLoading(true);
    try {
      const ids = pendingDeleteId === '__selected__' ? selectedIds : [pendingDeleteId];
      await Promise.all(ids.map((id) => teamMemberService.delete(id)));
      success(ids.length > 1 ? 'Team members deleted' : 'Team member deleted');
      setPendingDeleteId(null);
      setSelectedIds([]);
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to delete team member(s)');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSelect = (id, checked) => {
    setSelectedIds((current) => checked
      ? [...new Set([...current, id])]
      : current.filter((selectedId) => selectedId !== id));
  };

  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? members.map((member) => member._id) : []);
  };

  const handleEdit = async (member) => {
    try {
      setEditingMember(await teamMemberService.getById(member._id));
    } catch (err) {
      notifyError(err.message || 'Failed to load team member');
    }
  };

  const handleSave = async (id, payload) => {
    try {
      await teamMemberService.update(id, payload);
      success('Team member updated');
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to update team member');
      throw err;
    }
  };

  const handleViewProfile = async (member) => {
    try {
      setDetailsMember(await teamMemberService.getById(member._id));
    } catch (err) {
      notifyError(err.message || 'Failed to load member profile');
    }
  };

  return (

    <div className="space-y-6">
      <TeamMembersHeader
        onAddMember={() => setAddModalOpen(true)}
        onInviteMember={() => setInviteModalOpen(true)}
      />

      <TeamMembersStats
        totalMembers={pagination.totalItems || members.length}
        activeMembers={members.filter((m) => m.status === 'active').length}
        departments={departments.length}
        pendingInvites={0}
        adminsCount={members.filter((m) => m.roleId?.name?.toLowerCase().includes('admin')).length}
      />

      <div className="bg-transparent space-y-4">
        <TeamMembersFilters
          search={params.search}
          departmentId={params.departmentId}
          roleId={params.roleId}
          status={params.status}
          departments={departments}
          roles={roles}
          onFilterChange={updateFilters}
        />

        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
            <span className="text-sm font-medium text-indigo-800">{selectedIds.length} member(s) selected</span>
            <button
              type="button"
              onClick={() => setPendingDeleteId('__selected__')}
              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Delete selected
            </button>
          </div>
        )}

        <TeamMembersTable
          members={members}
          pagination={pagination}
          onView={handleViewProfile}
          onEdit={handleEdit}
          onDelete={setPendingDeleteId}
          onPageChange={changePage}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
        />

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems || members.length}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={changePage}
          onLimitChange={changeLimit}
          label="members"
        />
      </div>

      <AddMemberModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        departments={departments}
        roles={roles}
        onSuccess={refetch}
      />

      <InviteMemberModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        departments={departments}
        roles={roles}
        onSuccess={refetch}
      />

      <EditMemberModal
        isOpen={Boolean(editingMember)}
        member={editingMember}
        departments={departments}
        onClose={() => setEditingMember(null)}
        onSave={handleSave}
      />
      <MemberDetailsModal
        isOpen={Boolean(detailsMember)}
        member={detailsMember}
        onClose={() => setDetailsMember(null)}
      />
      <ConfirmDialog
        isOpen={Boolean(pendingDeleteId)}
        onClose={() => !deleteLoading && setPendingDeleteId(null)}
        onConfirm={handleDeleteSelected}
        title="Delete team member(s)"
        message={pendingDeleteId === '__selected__'
          ? `Delete ${selectedIds.length} selected team member(s)? This action cannot be undone.`
          : 'Delete this team member? This action cannot be undone.'}
        confirmText="Delete Member"
        danger
        loading={deleteLoading}
      />
    </div>
  );
};
