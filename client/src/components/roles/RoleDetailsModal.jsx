import React from 'react';
import { Modal } from '../common/Modal';

export const RoleDetailsModal = ({ isOpen, onClose, role }) => {
  if (!role) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Role Permissions Details">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">{role.name}</h4>
          <p className="text-xs text-slate-500">{role.description}</p>
        </div>
        <div>
          <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Assigned Permissions</h5>
          <div className="flex flex-wrap gap-1.5 max-h-60 overflow-y-auto">
            {(role.permissions || []).map((perm, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
                {perm.code || perm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
