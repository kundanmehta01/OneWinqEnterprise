import React from 'react';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const DeleteRoleModal = ({ isOpen, onClose, onConfirm, roleName = 'role', loading = false }) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Custom Role"
      message={`Are you sure you want to delete "${roleName}"? Any members currently assigned to this role will need to be reassigned.`}
      danger
      loading={loading}
    />
  );
};
