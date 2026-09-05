import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { roleService } from '../../services/roleService';
import { useNotification } from '../../hooks/useNotification';
import { usePermissions } from '../../hooks/usePermissions';
import { Check } from 'lucide-react';

const defaultPermissions = ['team.read', 'department.read', 'template.read'];

export const CreateRoleModal = ({ isOpen, onClose, onSuccess, role = null }) => {
  const { success, error: notifyError } = useNotification();
  const { permissions, loading: permissionsLoading, error: permissionsError } = usePermissions();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPerms, setSelectedPerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(role?._id);

  useEffect(() => {
    if (!isOpen) return;
    setName(role?.name || '');
    setDescription(role?.description || '');
    setSelectedPerms(Array.isArray(role?.permissions) ? role.permissions.map((permission) => typeof permission === 'string' ? permission : permission.code).filter(Boolean) : defaultPermissions);
  }, [isOpen, role]);

  const togglePerm = (code) => setSelectedPerms((prev) => prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const payload = { name: name.trim(), description, permissions: selectedPerms };
      if (isEditing) await roleService.update(role._id, payload);
      else await roleService.create(payload);
      success(isEditing ? 'Role updated successfully' : 'Role created successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      notifyError(err.message || `Failed to ${isEditing ? 'update' : 'create'} role`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Role' : 'Create Custom Role'} subtitle="Define access rights and module permissions for this role" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Role Name" placeholder="e.g. Operations Manager" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Description" placeholder="e.g. Can manage operations team and view basic reports" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Permissions ({selectedPerms.length} Selected)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 border border-slate-200 rounded-xl">
            {permissionsLoading ? (
              <p className="p-3 text-xs text-slate-400">Loading available permissions...</p>
            ) : permissionsError ? (
              <p className="p-3 text-xs text-rose-600">{permissionsError}</p>
            ) : permissions.map((permission) => {
              const checked = selectedPerms.includes(permission.code);
              return <button type="button" key={permission.code} onClick={() => togglePerm(permission.code)} className={`flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-left transition ${checked ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'hover:bg-slate-50 text-slate-600 border border-transparent'}`}><span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${checked ? 'bg-indigo-600 text-white' : 'border border-slate-300'}`}>{checked && <Check className="w-3 h-3" />}</span><span>{permission.name || permission.code}</span></button>;
            })}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100"><Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button><Button type="submit" isLoading={loading}>{isEditing ? 'Save Changes' : 'Create Role'}</Button></div>
      </form>
    </Modal>
  );
};
