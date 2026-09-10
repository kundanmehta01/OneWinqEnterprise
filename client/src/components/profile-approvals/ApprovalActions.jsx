import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export const ApprovalActions = ({ status, busy = false, onApprove, onRequestChanges, onReject, compact = false }) => {
  if (status !== 'pending') return null;
  const buttonClass = compact ? 'rounded-lg px-2 py-1 text-[11px]' : 'w-full rounded-lg px-4 py-2.5 text-xs';
  return <div className={compact ? 'flex items-center gap-1' : 'mt-6 space-y-2 border-t border-slate-100 pt-4'}>
    <button type="button" disabled={busy} onClick={onApprove} className={`${buttonClass} bg-emerald-600 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50`}><CheckCircle2 className="mr-1 inline h-3.5 w-3.5" />Approve</button>
    <button type="button" disabled={busy} onClick={onRequestChanges} className={`${buttonClass} bg-amber-500 font-semibold text-white hover:bg-amber-600 disabled:opacity-50`}><AlertTriangle className="mr-1 inline h-3.5 w-3.5" />Request Changes</button>
    <button type="button" disabled={busy} onClick={onReject} className={`${buttonClass} bg-rose-600 font-semibold text-white hover:bg-rose-700 disabled:opacity-50`}><XCircle className="mr-1 inline h-3.5 w-3.5" />Reject</button>
  </div>;
};
