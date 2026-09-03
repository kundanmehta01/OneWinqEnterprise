import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { teamMemberService } from '../../services/teamMemberService';
import { useNotification } from '../../hooks/useNotification';

export const AddMemberModal = ({
  isOpen,
  onClose,
  departments = [],
  roles = [],
  onSuccess
}) => {
  const { success, error: notifyError } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    employeeId: '',
    departmentId: '',
    roleId: '',
    status: 'active',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email address is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.roleId) newErrors.roleId = 'Please select a role';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        designation: formData.designation,
        roleId: formData.roleId,
        status: formData.status
      };
      if (formData.employeeId) payload.employeeId = formData.employeeId;
      if (formData.departmentId) payload.departmentId = formData.departmentId;
      if (formData.password) payload.password = formData.password;

      await teamMemberService.create(payload);
      success('Team member has been created successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      notifyError(err.message || 'Failed to create team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Member"
      subtitle="Fill in the details to create a member account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Priya Sharma"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        <Input
          label="Work Email"
          type="email"
          placeholder="e.g. priya@onewinq.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Designation"
            placeholder="e.g. Product Designer"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            error={errors.designation}
            required
          />
          <Input
            label="Employee ID (Optional)"
            placeholder="e.g. OWQ-104"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Department"
            placeholder="Select Department"
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            options={departments.map((d) => ({ value: d._id, label: d.name }))}
          />
          <Select
            label="Role"
            placeholder="Select Role"
            value={formData.roleId}
            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
            options={roles.map((r) => ({ value: r._id, label: r.name }))}
            error={errors.roleId}
            required
          />
        </div>

        <Input
          label="Initial Password (Optional)"
          type="password"
          placeholder="At least 8 characters"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          helperText="Leave empty to let member set their password via invitation link"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Add Member
          </Button>
        </div>
      </form>
    </Modal>
  );
};
