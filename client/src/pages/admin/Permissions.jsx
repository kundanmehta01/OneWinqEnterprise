import React, { useEffect, useMemo, useState } from 'react';
import { Crown, Shield, UserCheck, Users, CheckCircle2, Save } from 'lucide-react';
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

  const roleIcon = (role) => {
    if (role.name === 'Super Admin') return Crown;
    if (role.name.toLowerCase().includes('hr')) return UserCheck;
    if (role.name.toLowerCase().includes('member') || role.name.toLowerCase().includes('employee')) return Users;
    return Shield;
  };

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

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {roles.map((role) => {
          const Icon = roleIcon(role);
          const isSelected = role._id === selectedRoleId;
          return <button key={role._id} type="button" onClick={() => setSelectedRoleId(role._id)} className={`rounded-2xl border bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-md ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-100' : 'border-slate-100'}`}>
            <div className="flex items-start justify-between"><span className={`rounded-xl p-2.5 ${role.name === 'Super Admin' ? 'bg-violet-100 text-violet-700' : 'bg-indigo-50 text-indigo-600'}`}><Icon className="h-5 w-5" /></span>{isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}</div>
            <h2 className="mt-3 text-sm font-bold text-slate-900">{role.name}</h2>
            <p className="mt-1 min-h-8 text-xs leading-4 text-slate-500">{role.description || 'Role permission configuration'}</p>
            <p className="mt-3 text-[11px] font-semibold text-indigo-600">{role.permissions?.includes('*') ? 'All permissions' : `${role.permissions?.length || 0} permissions assigned`}</p>
          </button>;
        })}
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Permission details</p><h2 className="mt-1 text-lg font-bold text-slate-900">{selectedRole?.name || 'Select a role'}</h2><p className="mt-1 text-xs text-slate-500">{selectedRole?.description || 'Choose a role to manage module access.'}</p></div>
          <button type="button" onClick={savePermissions} disabled={!selectedRole || saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Saving...' : 'Save permissions'}</button>
        </div>
        <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-slate-500" htmlFor="role-select">Selected role</label>
        <select id="role-select" value={selectedRoleId} onChange={(event) => setSelectedRoleId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 sm:max-w-md">{roles.map((role) => <option key={role._id} value={role._id}>{role.name}</option>)}</select>
      </div>

      {!selectedRole ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">No roles available.</div>
      ) : (
        <div className="space-y-5">
          {Object.entries(groups).map(([moduleName, modulePermissions]) => {
            const permissionsByAction = (modulePermissions || []).reduce((result, permission) => {
              const action = permission.code.split('.').pop();
              result[action] = permission;
              return result;
            }, {});
            return (
            <section key={moduleName} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">{moduleName}</h2>
                <span className="text-xs text-slate-400">
                  {(modulePermissions || []).filter((permission) => selectedPermissions.includes(permission.code)).length}/{modulePermissions?.length || 0} enabled
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-xs">
                  <thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400"><th className="py-2">Permission</th>{['read', 'create', 'update', 'delete'].map((action) => <th key={action} className="py-2 text-center">{action === 'read' ? 'View' : action === 'update' ? 'Edit' : action}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 font-semibold text-slate-800">{moduleName}</td>
                      {['read', 'create', 'update', 'delete'].map((action) => {
                        const permission = permissionsByAction[action];
                        return <td key={action} className="py-3 text-center">{permission ? <input type="checkbox" checked={selectedPermissions.includes(permission.code)} onChange={() => togglePermission(permission.code)} className="h-4 w-4 accent-indigo-600" aria-label={`${moduleName} ${action}`} /> : <span className="text-slate-300">-</span>}</td>;
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            );
          })}
          {permissions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">No permissions are available from the backend.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PermissionsPage;
