import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export const AssignTemplateModal = ({ isOpen, onClose, onAssign, departments = [], loading = false }) => {
  const [departmentId, setDepartmentId] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Template to Department">
      <div className="space-y-4">
        <Select
          label="Target Department"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          options={[
            { label: 'Select Department', value: '' },
            ...departments.map((d) => ({ label: d.name, value: d._id }))
          ]}
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={!departmentId} onClick={() => onAssign?.(departmentId)} isLoading={loading}>
            Assign Template
          </Button>
        </div>
      </div>
    </Modal>
  );
};
