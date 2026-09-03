import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const RequestChangesModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(comment);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Profile Changes">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-slate-500">Provide constructive feedback for the employee on what needs revision.</p>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Reason for requesting changes..."
          required
          className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700"
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" isLoading={loading}>Send Feedback</Button>
        </div>
      </form>
    </Modal>
  );
};
