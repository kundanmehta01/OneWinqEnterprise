import React from 'react';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const DeleteDepartmentModal = ({ isOpen, onClose, onConfirm, departmentName = 'department', loading = false }) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Department"
      message={`Are you sure you want to delete ${departmentName}? All members must be reassigned first.`}
      danger
      loading={loading}
    />
  );
};
