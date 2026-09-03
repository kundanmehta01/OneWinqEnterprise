import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { roleService } from '../../services/roleService';
import { useNotification } from '../../hooks/useNotification';
import { Check } from 'lucide-react';

export const CreateRoleModal = ({ isOpen, onClose, onSuccess }) => {
  const { success, error: notifyError } = useNotification();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState([
    'team.read',
    'department.read',
    'template.read'
  ]);
  const [loading, setLoading] = useState(false);

  const availablePerms = [
    { code: 'team.read', label: 'View Team Members' },
    { code: 'team.create', label: 'Create Team Members' },
    { code: 'team.update', label: 'Edit Team Members' },
    { code: 'team.delete', label: 'Delete Team Members' },
    { code: 'department.read', label: 'View Departments' },
    { code: 'department.create', label: 'Create Departments' },
    { code: 'department.update', label: 'Edit Departments' },
    { code: 'department.delete', label: 'Delete Departments' },
    { code: 'template.read', label: 'View Templates' },
    { code: 'template.create', label: 'Create Templates' },
    { code: 'profile_approval.read', label: 'View Profile Approvals' },
    { code: 'profile_approval.approve', label: 'Approve Profiles' },
    { code: 'invitation.read', label: 'View Invitations' },
    { code: 'invitation.create', label: 'Send Invitations' },
    { code: 'analytics.read', label: 'View Analytics' },
    { code: 'audit_log.read', label: 'View Audit Logs' },
    { code: 'settings.read', label: 'View Organization Settings' }
  ];

  const togglePerm = (code) => {
    setSelectedPerms((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await roleService.create({
        name,
        description,
        permissions: selectedPerms
      });
      success('Role created successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      notifyError(err.message || 'Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Role"
      subtitle="Define access rights and module permissions for this role"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Role Name"
          placeholder="e.g. Operations Manager"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Description"
          placeholder="e.g. Can manage operations team and view basic reports"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
            Permissions ({selectedPerms.length} Selected)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 border border-slate-200 rounded-xl">
            {availablePerms.map((p) => {
              const isChecked = selectedPerms.includes(p.code);
              return (
                <button
                  type="button"
                  key={p.code}
                  onClick={() => togglePerm(p.code)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-left transition ${
                    isChecked
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                      isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Create Role
          </Button>
        </div>
      </form>
    </Modal>
  );
};
