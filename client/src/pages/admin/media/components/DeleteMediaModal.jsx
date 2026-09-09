import React from 'react';
import ConfirmModal from '../../../../components/common/ConfirmModal';

export default function DeleteMediaModal({ asset, onClose, onConfirm }) {
  return <ConfirmModal open={Boolean(asset)} title="Delete media asset" message={`Are you sure you want to delete "${asset?.originalName || 'this file'}"? This action cannot be undone.`} confirmLabel="Delete" onClose={onClose} onConfirm={onConfirm} />;
}
