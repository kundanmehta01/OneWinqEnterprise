import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { approvalService } from '../../services/approvalService';
import { useNotification } from '../../hooks/useNotification';
import { AlertTriangle } from 'lucide-react';

export const RequestChangesModal = ({ isOpen, onClose, approval, onSuccess }) => {
  const { success, error: notifyError } = useNotification();
  const [reviewNote, setReviewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!approval || approval.status !== 'pending') {
      notifyError('Only pending profile requests can be reviewed.');
      return;
    }

    setLoading(true);
    try {
      await approvalService.requestChanges(approval._id, reviewNote, [reviewNote]);
      success('Changes requested successfully');
      onSuccess?.();
      onClose();
      setReviewNote('');
    } catch (err) {
      notifyError(err.message || 'Failed to request changes');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReviewNote('');
    onClose();
  };

  if (!approval) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Request Profile Changes"
      subtitle={`Provide feedback for ${approval.memberId?.name || 'employee'}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">Provide constructive feedback for the employee on what needs revision. This will be sent to the employee for review.</p>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Feedback / Changes Required
          </label>
          <textarea
            rows={4}
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            placeholder="Describe what changes are needed..."
            required
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            isLoading={loading}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Request Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
