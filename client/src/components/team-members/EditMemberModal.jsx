import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export const EditMemberModal = ({ isOpen, onClose, member, departments = [], onSave }) => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setName(member.name || '');
      setDesignation(member.designation || '');
      setDepartmentId(member.departmentId?._id || member.departmentId || '');
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave?.(member._id, { name, designation, departmentId });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Team Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} />
        <Select
          label="Department"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
          options={[
            { label: 'Select Department', value: '' },
            ...departments.map((d) => ({ label: d.name, value: d._id }))
          ]}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit" isLoading={loading}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};
