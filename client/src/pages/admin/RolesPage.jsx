import React, { useMemo, useState } from 'react';
import { useRoles } from '../../hooks/useRoles';
import { RolesHeader } from '../../components/roles/RolesHeader';
import { RolesStats } from '../../components/roles/RolesStats';
import { RolesTable } from '../../components/roles/RolesTable';
import { PermissionMatrixPane } from '../../components/permissions/PermissionMatrixPane';
import { CreateRoleModal } from '../../components/roles/CreateRoleModal';
import { EditRoleModal } from '../../components/roles/EditRoleModal';
import { Pagination } from '../../components/common/Pagination';
import { roleService } from '../../services/roleService';
import { useNotification } from '../../hooks/useNotification';

export const RolesPage = () => {
  const { roles, refetch } = useRoles();
  const { success, error: notifyError } = useNotification();
  const [selectedRole, setSelectedRole] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredRoles = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return roles;
    return roles.filter((role) => [role.name, role.description, role.code].filter(Boolean).some((value) => String(value).toLowerCase().includes(term)));
  }, [roles, search]);

  const activeSelected = filteredRoles.find((role) => role._id === selectedRole?._id) || filteredRoles[0] || null;

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom role?')) return;
    try {
      await roleService.delete(id);
      success('Role deleted successfully');
      setSelectedRole(null);
      refetch();
    } catch (err) {
      notifyError(err.message || 'Failed to delete role');
    }
  };

  const handleSelectRoleId = (id) => {
    const found = roles.find((role) => role._id === id);
    if (found) setSelectedRole(found);
  };

  return (
    <div className="space-y-6">
      <RolesHeader onCreateRole={() => setCreateModalOpen(true)} onMatrixToggle={() => {}} />
      <RolesStats totalRoles={roles.length} activeRoles={roles.filter((r) => r.isActive !== false).length} inactiveRoles={roles.filter((r) => r.isActive === false).length} customRoles={roles.filter((r) => !r.isSystem).length} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <RolesTable roles={filteredRoles} selectedRole={activeSelected} onSelectRole={setSelectedRole} search={search} onSearchChange={setSearch} onEditRole={setEditingRole} onDeleteRole={handleDelete} />
          <Pagination currentPage={1} totalPages={1} totalItems={filteredRoles.length} itemsPerPage={filteredRoles.length || 10} onPageChange={() => {}} label="roles" />
        </div>
        <div className="lg:col-span-5"><PermissionMatrixPane roles={filteredRoles} selectedRole={activeSelected} onSelectRoleId={handleSelectRoleId} /></div>
      </div>
      <CreateRoleModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} onSuccess={refetch} />
      <EditRoleModal isOpen={Boolean(editingRole)} role={editingRole} onClose={() => setEditingRole(null)} onSuccess={refetch} />
    </div>
  );
};

export default RolesPage;
