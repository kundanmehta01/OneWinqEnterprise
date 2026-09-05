import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { approvalService } from '../../services/approvalService';
import { useNotification } from '../../hooks/useNotification';

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  if (Array.isArray(value)) {
    return value.map((item) => typeof item === 'object' ? Object.entries(item).filter(([, entry]) => entry !== null && entry !== undefined && entry !== '').map(([key, entry]) => `${key}: ${formatValue(entry)}`).join(' · ') : String(item)).join('\n');
  }
  if (typeof value === 'object') {
    return Object.entries(value).filter(([, entry]) => entry !== null && entry !== undefined && entry !== '').map(([key, entry]) => `${key}: ${formatValue(entry)}`).join(' · ');
  }
  return String(value);
};

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
  const previous = approval.memberId?.profileId?.published || approval.currentSnapshot || {};
  const comparisonKeys = Array.from(new Set([...Object.keys(previous), ...Object.keys(draft)]))
    .filter((key) => !['updatedAt', 'createdAt'].includes(key));
  const canReview = approval.status === 'pending';

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

        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Compare changes</h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400"><th className="py-2">Field</th><th className="py-2">Before</th><th className="py-2">After</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonKeys.length ? comparisonKeys.map((key) => {
                  const before = formatValue(previous[key]);
                  const after = formatValue(draft[key]);
                  return <tr key={key}><td className="py-2 font-semibold capitalize text-slate-700 align-top">{key.replace(/([A-Z])/g, ' $1')}</td><td className="max-w-[180px] whitespace-pre-wrap break-words py-2 align-top text-slate-500">{before}</td><td className={`max-w-[180px] whitespace-pre-wrap break-words py-2 align-top ${before !== after ? 'font-semibold text-indigo-700' : 'text-slate-500'}`}>{after}</td></tr>;
                }) : <tr><td colSpan="3" className="py-3 text-center text-slate-500">No comparable profile fields were returned.</td></tr>}
              </tbody>
            </table>
          </div>
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
           {!canReview ? (
             <>
               <p className="mr-2 text-right text-[11px] text-slate-500">
                 Current status: <span className="font-semibold capitalize">{approval.status.replace('_', ' ')}</span>. Actions are disabled for this completed request.
               </p>
               <Button variant="danger" size="sm" icon={XCircle} disabled>Reject</Button>
               <Button variant="secondary" size="sm" icon={AlertTriangle} disabled>Request Changes</Button>
               <Button variant="primary" size="sm" icon={CheckCircle2} disabled>Approve Profile</Button>
             </>
           ) : (
             <>
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
             </>
           )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
