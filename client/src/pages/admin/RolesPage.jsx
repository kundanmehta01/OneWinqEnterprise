import React, { useState } from 'react';
import { useRoles } from '../../hooks/useRoles';
import { RolesHeader } from '../../components/roles/RolesHeader';
import { RolesStats } from '../../components/roles/RolesStats';
import { RolesTable } from '../../components/roles/RolesTable';
import { PermissionMatrixPane } from '../../components/permissions/PermissionMatrixPane';
import { CreateRoleModal } from '../../components/roles/CreateRoleModal';
import { Pagination } from '../../components/common/Pagination';
import { roleService } from '../../services/roleService';
import { useNotification } from '../../hooks/useNotification';

export const RolesPage = () => {
  const { roles, loading, refetch } = useRoles();
  const { success, error: notifyError } = useNotification();

  const [selectedRole, setSelectedRole] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const activeSelected = selectedRole || (roles.length > 0 ? roles[0] : null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom role?')) return;
    try {
      await roleService.delete(id);
      success('Role deleted successfully');
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to delete role');
    }
  };

  const handleSelectRoleId = (id) => {
    const found = roles.find((r) => r._id === id);
    if (found) setSelectedRole(found);
  };

  return (
    <div className="space-y-6">
      <RolesHeader
        onCreateRole={() => setCreateModalOpen(true)}
        onMatrixToggle={() => {}}
      />

      <RolesStats
        totalRoles={roles.length}
        activeRoles={roles.filter((r) => r.isActive !== false).length}
        inactiveRoles={roles.filter((r) => r.isActive === false).length}
        customRoles={roles.filter((r) => !r.isSystem).length}
      />

      {/* 2-Column Split: Roles Directory Table + Permission Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <RolesTable
            roles={roles}
            selectedRole={activeSelected}
            onSelectRole={setSelectedRole}
            search={search}
            onSearchChange={setSearch}
            onDeleteRole={handleDelete}
          />

          <Pagination
            currentPage={1}
            totalPages={1}
            totalItems={roles.length}
            itemsPerPage={10}
            onPageChange={() => {}}
            label="roles"
          />
        </div>

        <div className="lg:col-span-5">
          <PermissionMatrixPane
            roles={roles}
            selectedRole={activeSelected}
            onSelectRoleId={handleSelectRoleId}
          />
        </div>
      </div>

      <CreateRoleModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};
