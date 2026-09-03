import React, { useMemo, useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { PermissionTable } from '../../components/permissions/PermissionTable';
import { PermissionMatrix } from '../../components/permissions/PermissionMatrix';
import { Search, Grid, List } from 'lucide-react';

const matchesSearch = (permission, term) =>
  !term || [permission.name, permission.code, permission.module, permission.description]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(term));

export const PermissionsPage = () => {
  const { permissions, groupedPermissions, loading } = usePermissions();
  const [viewMode, setViewMode] = useState('matrix');
  const [search, setSearch] = useState('');
  const term = search.trim().toLowerCase();

  const filteredPermissions = useMemo(
    () => permissions.filter((permission) => matchesSearch(permission, term)),
    [permissions, term]
  );

  const filteredGroupedPermissions = useMemo(() => {
    if (!term) return groupedPermissions;
    return Object.entries(groupedPermissions || {}).reduce((result, [module, modulePermissions]) => {
      const list = Array.isArray(modulePermissions) ? modulePermissions : [];
      const filtered = list.filter((permission) => matchesSearch({ ...permission, module }, term));
      if (filtered.length) result[module] = filtered;
      return result;
    }, {});
  }, [groupedPermissions, term]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Permissions</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Granular access control capabilities across all enterprise platform modules</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button type="button" aria-label="Matrix view" onClick={() => setViewMode('matrix')} className={`p-1.5 rounded-lg transition ${viewMode === 'matrix' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}><Grid className="w-4 h-4" /></button>
          <button type="button" aria-label="List view" onClick={() => setViewMode('table')} className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="search" placeholder="Filter permissions by name, code, or module..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 bg-white text-xs text-slate-800" />
      </div>
      {loading ? <div className="py-24"><LoadingSpinner message="Loading permissions..." /></div> : viewMode === 'matrix' ? <PermissionMatrix grouped={filteredGroupedPermissions} /> : <PermissionTable permissions={filteredPermissions} />}
    </div>
  );
};

export default PermissionsPage;
