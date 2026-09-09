import React, { useState } from 'react';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { FileText, Eye, Shield, Users, KeyRound, FileCog, UserRound, BarChart3, Settings, Send, Building2 } from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../utils/formatDate';

export const AuditLogsPage = () => {
  const { logs, pagination, params, loading, error, updateFilters, changePage } = useAuditLogs();
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleOpenDetails = (log) => {
    setSelectedLog(log);
    setDetailsModalOpen(true);
  };

  const getActionBadgeVariant = (action = '') => {
    const act = action.toLowerCase();
    if (act.includes('create') || act.includes('login')) return 'green';
    if (act.includes('update') || act.includes('edit')) return 'blue';
    if (act.includes('delete') || act.includes('archive')) return 'red';
    return 'purple';
  };
  const moduleIcon = (module = '') => {
    const value = module.toLowerCase();
    if (value.includes('role') || value.includes('permission')) return KeyRound;
    if (value.includes('template')) return FileCog;
    if (value.includes('profile')) return UserRound;
    if (value.includes('analytic')) return BarChart3;
    if (value.includes('team') || value.includes('member')) return Users;
    if (value.includes('department')) return Building2;
    if (value.includes('setting')) return Settings;
    if (value.includes('invitation')) return Send;
    return Shield;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable, cryptographically recorded audit trail of system events and administrative actions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-[11px] font-semibold text-slate-500">From <input type="date" value={params.startDate || ''} onChange={(event) => updateFilters({ startDate: event.target.value })} className="ml-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700" /></label>
          <label className="text-[11px] font-semibold text-slate-500">To <input type="date" value={params.endDate || ''} onChange={(event) => updateFilters({ endDate: event.target.value })} className="ml-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700" /></label>
          <select
            value={params.module}
            onChange={(e) => updateFilters({ module: e.target.value })}
            className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">All Modules</option>
            <option value="auth">Authentication</option>
            <option value="team">Team Members</option>
            <option value="departments">Departments</option>
            <option value="roles">Roles</option>
            <option value="templates">Templates</option>
            <option value="profile_approval">Profile Approvals</option>
            <option value="settings">Settings</option>
          </select>
        </div>
      </div>

      {error ? <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : loading ? (
        <div className="py-24">
          <LoadingSpinner message="Loading audit trail entries..." />
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No audit records found"
          description="There are no immutable audit logs recorded under this filter criteria."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Timestamp</th>
                  <th className="py-3.5 px-4">Actor</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Module</th>
                  <th className="py-3.5 px-4">IP Address</th>
                  <th className="py-3.5 px-5 text-right">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                      {formatDate(log.timestamp, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">{(log.actorId?.email || 'S').charAt(0).toUpperCase()}</div><div><span className="block font-bold text-slate-900">{log.actorId?.email || 'System'}</span><span className="text-[10px] text-slate-400">{formatRelativeTime(log.timestamp)}</span></div></div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      <span className="inline-flex items-center gap-2"><span className="rounded-lg bg-slate-50 p-1.5 text-indigo-600">{React.createElement(moduleIcon(log.module), { className: 'h-3.5 w-3.5' })}</span>{log.module}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {log.ipAddress || '127.0.0.1'}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={Eye}
                        onClick={() => handleOpenDetails(log)}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={changePage}
            label="records"
          />
        </div>
      )}

      {detailsModalOpen && selectedLog && <div className="fixed inset-0 z-40 bg-slate-900/20" onClick={() => setDetailsModalOpen(false)}>
        <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Activity Details</p><h2 className="mt-1 text-lg font-bold text-slate-900">{selectedLog.action}</h2><p className="mt-1 text-xs text-slate-500">{selectedLog.module}</p></div><button type="button" onClick={() => setDetailsModalOpen(false)} className="text-xl text-slate-400 hover:text-slate-700">×</button></div>
        {selectedLog && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase">Actor:</span>
                <p className="font-semibold text-slate-900">{selectedLog.actorId?.email || 'System'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase">IP Address:</span>
                <p className="font-mono text-slate-900">{selectedLog.ipAddress || '127.0.0.1'}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase">Timestamp:</span>
                <p className="text-slate-900">{new Date(selectedLog.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase">Resource ID:</span>
                <p className="font-mono text-slate-900">{selectedLog.resourceId || 'N/A'}</p>
              </div>
            </div>

            {selectedLog.newValue && (
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">
                  Recorded Payload State:
                </span>
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] overflow-x-auto font-mono max-h-56">
                  {JSON.stringify(selectedLog.newValue, null, 2)}
                </pre>
              </div>
            )}
            {selectedLog.previousValue && (
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Previous Value:</span>
                <pre className="p-3 rounded-xl bg-slate-50 text-slate-700 text-[11px] overflow-x-auto font-mono max-h-40">{JSON.stringify(selectedLog.previousValue, null, 2)}</pre>
              </div>
            )}
            {selectedLog.userAgent && <div className="rounded-xl border border-slate-100 p-3"><span className="text-slate-400 text-[10px] font-bold uppercase">Device / User Agent:</span><p className="mt-1 break-words text-slate-700">{selectedLog.userAgent}</p></div>}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setDetailsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
        </aside>
      </div>}
    </div>
  );
};
