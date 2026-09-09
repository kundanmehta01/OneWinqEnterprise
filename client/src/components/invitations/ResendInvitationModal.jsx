import React from 'react';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const ResendInvitationModal = ({ isOpen, onClose, onConfirm, inviteeName = 'member', loading = false }) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Resend Invitation"
      message={`Send a fresh invitation link to ${inviteeName}? The previous invitation token will be refreshed.`}
      confirmText="Resend Link"
      loading={loading}
    />
  );
};
