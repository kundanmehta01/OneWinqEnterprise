import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

export const MemberDetailsModal = ({ isOpen, onClose, member }) => {
  if (!member) return null;
  const profile = member.profileId || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Member Profile Overview">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center">
            {member.name?.charAt(0) || 'M'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
            <p className="text-xs text-slate-400">{member.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl">
            <span className="text-slate-400 block mb-1">Designation</span>
            <span className="font-bold text-slate-800">{member.designation || '-'}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <span className="text-slate-400 block mb-1">Department</span>
            <span className="font-bold text-slate-800">{member.departmentId?.name || 'General'}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
