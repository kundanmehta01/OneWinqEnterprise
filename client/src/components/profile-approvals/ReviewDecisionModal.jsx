import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { approvalService } from '../../services/approvalService';
import { useNotification } from '../../hooks/useNotification';

const actions = [
  { value: 'approve', label: 'Approve Profile', icon: CheckCircle2, active: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
  { value: 'request_changes', label: 'Request Changes', icon: AlertTriangle, active: 'border-amber-500 bg-amber-50 text-amber-800' },
  { value: 'reject', label: 'Reject Profile', icon: XCircle, active: 'border-rose-500 bg-rose-50 text-rose-800' }
];

export const ReviewDecisionModal = ({ isOpen, approval, onClose, onSuccess }) => {
  const { error: notifyError } = useNotification();
  const [action, setAction] = useState('approve');
  const [reviewNote, setReviewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const selected = actions.find((item) => item.value === action);

  const close = () => { setAction('approve'); setReviewNote(''); onClose(); };
  const submit = async (event) => {
    event.preventDefault();
    if (!approval || approval.status !== 'pending') { notifyError('Only pending profile requests can be reviewed.'); return; }
    if (action === 'request_changes' && !reviewNote.trim()) { notifyError('Please describe the changes required.'); return; }
    setLoading(true);
    try {
      await approvalService.review(approval._id, { action, reviewNote, requestedChanges: action === 'request_changes' ? [reviewNote] : [] });
      await onSuccess?.(action);
      close();
    } catch (err) {
      notifyError(err.message || 'Unable to submit this review. The request may already have been reviewed.');
    } finally { setLoading(false); }
  };

  if (!approval) return null;
  return <Modal isOpen={isOpen} onClose={close} title="Review Profile Request" subtitle={`Choose one decision for ${approval.memberId?.name || 'this employee'}`} maxWidth="max-w-lg"><form onSubmit={submit} className="space-y-5"><div><label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">Decision</label><div className="grid gap-2">{actions.map((item) => { const Icon = item.icon; return <button key={item.value} type="button" onClick={() => setAction(item.value)} className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm font-semibold ${action === item.value ? item.active : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Icon className="h-4 w-4" />{item.label}</button>; })}</div></div><div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">{action === 'request_changes' ? 'Changes required' : action === 'reject' ? 'Rejection reason (optional)' : 'Reviewer note (optional)'}</label><textarea required={action === 'request_changes'} rows={4} value={reviewNote} onChange={(event) => setReviewNote(event.target.value)} placeholder={action === 'request_changes' ? 'Explain what the employee needs to update…' : 'Add a note for the employee…'} className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-indigo-500 focus:outline-none" /></div><div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="secondary" onClick={close} disabled={loading}>Cancel</Button><Button type="submit" variant={action === 'reject' ? 'danger' : 'primary'} isLoading={loading}>{selected.label}</Button></div></form></Modal>;
};
