import React from 'react';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const DeleteTemplateModal = ({ isOpen, onClose, onConfirm, templateName = 'template', loading = false }) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Archive Template"
      message={`Are you sure you want to archive "${templateName}"? Profiles using this template will fall back to the default design.`}
      danger
      loading={loading}
    />
  );
};
