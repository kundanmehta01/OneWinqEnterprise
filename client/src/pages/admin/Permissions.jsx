import React, { useEffect, useMemo, useState } from 'react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { permissionService } from '../../services/permissionService';
import { roleService } from '../../services/roleService';
import { useNotification } from '../../hooks/useNotification';

export const PermissionsPage = () => {
  const { success, error: notifyError } = useNotification();
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState({});
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [roleList, permissionGroups] = await Promise.all([
        roleService.getAll({ includeInactive: true }),
        permissionService.getByModule()
      ]);
      setRoles(Array.isArray(roleList) ? roleList : []);
      setGroups(permissionGroups || {});
      if (!selectedRoleId && roleList?.length) setSelectedRoleId(roleList[0]._id);
    } catch (err) {
      const message = err.message || 'Failed to load roles and permissions';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedRole = useMemo(
    () => roles.find((role) => role._id === selectedRoleId) || null,
    [roles, selectedRoleId]
  );

  useEffect(() => {
    setSelectedPermissions(selectedRole?.permissions || []);
  }, [selectedRole]);

  const permissions = useMemo(
    () => Object.values(groups).flatMap((modulePermissions) => modulePermissions || []),
    [groups]
  );

  const togglePermission = (code) => {
    setSelectedPermissions((current) => (
      current.includes(code)
        ? current.filter((permission) => permission !== code)
        : [...current, code]
    ));
  };

  const savePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      const updated = await roleService.update(selectedRole._id, { permissions: selectedPermissions });
      setRoles((current) => current.map((role) => role._id === updated._id ? updated : role));
      success('Permissions updated successfully');
    } catch (err) {
      notifyError(err.message || 'Failed to update permissions');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-24"><LoadingSpinner message="Loading roles and permissions..." /></div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-slate-500">Assign backend-defined permissions to each organization role.</p>
      </div>

      {error && <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="role-select">
          Select role
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            id="role-select"
            value={selectedRoleId}
            onChange={(event) => setSelectedRoleId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 sm:max-w-md"
          >
            {roles.map((role) => <option key={role._id} value={role._id}>{role.name}</option>)}
          </select>
          <button
            type="button"
            onClick={savePermissions}
            disabled={!selectedRole || saving}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save permissions'}
          </button>
        </div>
        {selectedRole && <p className="mt-2 text-xs text-slate-500">{selectedRole.description || 'Role permission configuration'}</p>}
      </div>

      {!selectedRole ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">No roles available.</div>
      ) : (
        <div className="space-y-5">
          {Object.entries(groups).map(([moduleName, modulePermissions]) => (
            <section key={moduleName} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">{moduleName}</h2>
                <span className="text-xs text-slate-400">
                  {(modulePermissions || []).filter((permission) => selectedPermissions.includes(permission.code)).length}/{modulePermissions?.length || 0} enabled
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {(modulePermissions || []).map((permission) => (
                  <label key={permission.code} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 hover:border-indigo-300">
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.code)}
                      onChange={() => togglePermission(permission.code)}
                      className="mt-0.5 h-4 w-4 accent-indigo-600"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">{permission.name || permission.code}</span>
                      <span className="mt-1 block text-xs text-slate-500">{permission.code}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          ))}
          {permissions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">No permissions are available from the backend.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PermissionsPage;
