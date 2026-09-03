import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { approvalService } from '../../services/approvalService';
import { useNotification } from '../../hooks/useNotification';

export const ReviewModal = ({ isOpen, onClose, approval, onSuccess }) => {
  const { success, error: notifyError } = useNotification();
  const [reviewNote, setReviewNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!approval) return null;

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await approvalService.review(approval._id, {
        action,
        reviewNote
      });
      success(`Profile review submitted (${action})`);
      onSuccess?.();
      onClose();
    } catch (err) {
      notifyError(err.message || 'Failed to review approval request');
    } finally {
      setLoading(false);
    }
  };

  const draft = approval.draftSnapshot || {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Profile Submission"
      subtitle={`Submitted by ${approval.memberId?.name || 'Employee'}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Draft Summary Box */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2.5 text-xs">
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Headline:</span>
            <p className="font-semibold text-slate-800 mt-0.5">{draft.headline || 'No headline provided'}</p>
          </div>
          <div>
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Bio:</span>
            <p className="text-slate-600 mt-0.5 leading-relaxed">{draft.bio || 'No bio provided'}</p>
          </div>
          {draft.skills && draft.skills.length > 0 && (
            <div>
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Skills:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {draft.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-[11px] font-medium">
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Review Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Reviewer Note / Feedback
          </label>
          <textarea
            rows={3}
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            placeholder="Add comments or instructions for the employee..."
            className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              icon={XCircle}
              onClick={() => handleAction('reject')}
              isLoading={loading}
            >
              Reject
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={AlertTriangle}
              onClick={() => handleAction('request_changes')}
              isLoading={loading}
            >
              Request Changes
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={() => handleAction('approve')}
              isLoading={loading}
            >
              Approve Profile
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
