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

  const handleArchive = async (id) => {
    if (!window.confirm('Are you sure you want to archive this team member?')) return;
    try {
      await teamMemberService.archive(id);
      success('Team member archived');
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to archive team member');
    }
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

        <TeamMembersTable
          members={members}
          loading={loading}
          onEditMember={handleEdit}
          onViewProfile={handleViewProfile}
          onArchiveMember={handleArchive}
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
    </div>
  );
};
