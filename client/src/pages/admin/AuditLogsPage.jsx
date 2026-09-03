import React, { useState } from 'react';
import { useAuditLogs } from '../../hooks/useAuditLogs';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Pagination } from '../../components/common/Pagination';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { FileText, Search, Filter, Eye, Shield } from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../utils/formatDate';

export const AuditLogsPage = () => {
  const { logs, pagination, params, loading, updateFilters, changePage } = useAuditLogs();
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

        {/* Module Filter */}
        <div className="flex items-center gap-2">
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

      {loading ? (
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
                      <span className="font-bold text-slate-900">
                        {log.actorId?.email || 'System'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      {log.module}
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

      {/* Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Audit Record Inspection"
        subtitle={`Action: ${selectedLog?.action} on module ${selectedLog?.module}`}
        maxWidth="max-w-2xl"
      >
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

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setDetailsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
