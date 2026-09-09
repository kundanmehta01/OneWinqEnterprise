import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { departmentService } from '../../services/departmentService';
import { useNotification } from '../../hooks/useNotification';

export const DepartmentModal = ({
  isOpen,
  onClose,
  department = null,
  onSuccess
}) => {
  const { success, error: notifyError } = useNotification();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      setName(department.name || '');
      setDescription(department.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [department, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      if (department?._id) {
        await departmentService.update(department._id, { name, description });
        success('Department updated successfully');
      } else {
        await departmentService.create({ name, description });
        success('Department created successfully');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      notifyError(err.message || 'Failed to save department');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={department ? 'Edit Department' : 'Create Department'}
      subtitle="Organize team members by organizational department"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Department Name"
          placeholder="e.g. Engineering, Marketing, Product"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Description"
          placeholder="e.g. Core product engineering and infrastructure teams"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {department ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
