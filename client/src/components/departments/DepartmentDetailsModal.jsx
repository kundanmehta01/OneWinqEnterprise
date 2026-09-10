import React from 'react';
import { Modal } from '../common/Modal';

export const DepartmentDetailsModal = ({ isOpen, onClose, department }) => {
  if (!department) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Department Details">
      <div className="space-y-3 text-xs">
        <div>
          <span className="text-slate-400 block">Name</span>
          <span className="font-bold text-slate-900 text-sm">{department.name}</span>
        </div>
        <div>
          <span className="text-slate-400 block">Description</span>
          <p className="text-slate-700">{department.description || 'No description provided'}</p>
        </div>
        <div>
          <span className="text-slate-400 block">Members Assigned</span>
          <span className="font-bold text-indigo-600">{department.memberCount || 0}</span>
        </div>
      </div>
    </Modal>
  );
};
