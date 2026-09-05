import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { approvalService } from '../../services/approvalService';
import { useNotification } from '../../hooks/useNotification';
import { XCircle, AlertTriangle } from 'lucide-react';

export const RejectConfirmationModal = ({ isOpen, onClose, approval, onSuccess }) => {
  const { success, error: notifyError } = useNotification();
  const [reviewNote, setReviewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!approval) return;

    setLoading(true);
    try {
      await approvalService.review(approval._id, {
        action: 'reject',
        reviewNote
      });
      success('Profile rejected successfully');
      onSuccess?.();
      onClose();
      setReviewNote('');
    } catch (err) {
      notifyError(err.message || 'Failed to reject profile');
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
      title="Reject Profile Request"
      subtitle={`Are you sure you want to reject ${approval.memberId?.name || 'employee'}'s profile?`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 flex gap-2">
          <XCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-rose-800">This action cannot be undone. The employee will be notified that their profile has been rejected.</p>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Rejection Reason (Optional)
          </label>
          <textarea
            rows={3}
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            placeholder="Provide a reason for rejection..."
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            type="submit" 
            isLoading={loading}
            icon={XCircle}
          >
            Reject Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
};