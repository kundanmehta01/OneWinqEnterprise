import React from 'react';
import { Modal } from '../common/Modal';

export const AuditLogDetails = ({ isOpen, onClose, log }) => {
  if (!log) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Audit Trail Entry">
      <div className="space-y-3 text-xs">
        <div>
          <span className="text-slate-400 block">Actor</span>
          <span className="font-bold text-slate-900">{log.actorEmail}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Action</span>
          <span className="font-mono text-indigo-600 font-bold">{log.action}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Metadata</span>
          <pre className="bg-slate-50 p-3 rounded-xl overflow-x-auto text-[11px] font-mono">
            {JSON.stringify(log.metadata || {}, null, 2)}
          </pre>
        </div>
      </div>
    </Modal>
  );
};
