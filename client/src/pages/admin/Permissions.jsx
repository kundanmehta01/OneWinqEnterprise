import React, { useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { PermissionTable } from '../../components/permissions/PermissionTable';
import { PermissionMatrix } from '../../components/permissions/PermissionMatrix';
import { ShieldCheck, Search, Grid, List } from 'lucide-react';

export const PermissionsPage = () => {
  const { permissions, groupedPermissions, loading } = usePermissions();
  const [viewMode, setViewMode] = useState('matrix');
  const [search, setSearch] = useState('');

  const filteredPermissions = permissions.filter((p) =>
    (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.code || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.module || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            System Permissions
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Granular access control capabilities across all enterprise platform modules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('matrix')}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'matrix' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'table' ? 'bg-white shadow-2xs text-indigo-600' : 'text-slate-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter permissions by name or module..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 bg-white text-xs text-slate-800"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-24">
          <LoadingSpinner message="Loading permissions..." />
        </div>
      ) : viewMode === 'matrix' ? (
        <PermissionMatrix grouped={groupedPermissions} />
      ) : (
        <PermissionTable permissions={filteredPermissions} />
      )}
    </div>
  );
};

export default PermissionsPage;
