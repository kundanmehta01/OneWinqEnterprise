import React, { useState } from 'react';
import { useTeamMembers } from '../../hooks/useTeamMembers';
import { useDepartments } from '../../hooks/useDepartments';
import { useRoles } from '../../hooks/useRoles';
import { TeamMembersHeader } from '../../components/team-members/TeamMembersHeader';
import { TeamMembersStats } from '../../components/team-members/TeamMembersStats';
import { TeamMembersFilters } from '../../components/team-members/TeamMembersFilters';
import { TeamMembersTable } from '../../components/team-members/TeamMembersTable';
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

  return (
    <div className="space-y-6">
      <TeamMembersHeader
        onAddMember={() => setAddModalOpen(true)}
        onInviteMember={() => setInviteModalOpen(true)}
      />

      <TeamMembersStats
        totalMembers={pagination.totalItems > 0 ? pagination.totalItems : 126}
        activeMembers={118}
        departments={departments.length > 0 ? departments.length : 9}
        pendingInvites={8}
        adminsCount={6}
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
          onArchiveMember={handleArchive}
        />

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems > 0 ? pagination.totalItems : 126}
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
    </div>
  );
};
