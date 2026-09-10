import React from 'react';
import { Copy, RefreshCw, XCircle } from 'lucide-react';

export const InvitationActions = ({ invitation, onResend, onCancel, onCopy }) => {
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => onCopy?.(invitation)} title="Copy Link" className="p-1 text-slate-400 hover:text-indigo-600">
        <Copy className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => onResend?.(invitation._id)} title="Resend" className="p-1 text-slate-400 hover:text-slate-700">
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => onCancel?.(invitation._id)} title="Cancel" className="p-1 text-slate-400 hover:text-rose-600">
        <XCircle className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
