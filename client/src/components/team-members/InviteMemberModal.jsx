import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { invitationService } from '../../services/invitationService';
import { useNotification } from '../../hooks/useNotification';

export const InviteMemberModal = ({
  isOpen,
  onClose,
  departments = [],
  roles = [],
  onSuccess
}) => {
  const { success, error: notifyError } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    designation: 'Team Member',
    departmentId: '',
    roleId: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    if (!formData.roleId) {
      setErrors({ roleId: 'Please select a role' });
      return;
    }

    setLoading(true);
    try {
      await invitationService.create({
        email: formData.email,
        name: formData.name,
        designation: formData.designation,
        roleId: formData.roleId,
        departmentId: formData.departmentId || undefined
      });
      success('Invitation sent successfully to ' + formData.email);
      onSuccess?.();
      onClose();
    } catch (err) {
      notifyError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite New Team Member"
      subtitle="Send an invitation link for the user to set up their profile"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="colleague@onewinq.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />

        <Input
          label="Full Name (Optional)"
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="Designation"
          placeholder="e.g. Software Engineer"
          value={formData.designation}
          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Department"
            placeholder="Select Department"
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
            options={departments.map((d) => ({ value: d._id, label: d.name }))}
          />
          <Select
            label="Assign Role"
            placeholder="Select Role"
            value={formData.roleId}
            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
            options={roles.map((r) => ({ value: r._id, label: r.name }))}
            error={errors.roleId}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Send Invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
};
