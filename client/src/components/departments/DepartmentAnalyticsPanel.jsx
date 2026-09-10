import React from 'react';
import { Activity, BarChart3, Building2, Users } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatDate';

const actionLabel = (log) => {
  const action = String(log.action || '').replace(/[._-]/g, ' ').toLowerCase();
  if (action.includes('create')) return 'New department created';
  if (action.includes('member') && (action.includes('add') || action.includes('assign') || action.includes('join'))) return 'Member added to department';
  if (action.includes('update') || action.includes('edit')) return 'Department updated';
  if (action.includes('delete')) return 'Department deleted';
  return log.action || 'Department activity';
};

export default function DepartmentAnalyticsPanel({ departments, logs = [], loading, error }) {
  const totalMembers = departments.reduce((sum, department) => sum + Number(department.memberCount || 0), 0);
  const maxMembers = Math.max(...departments.map((department) => Number(department.memberCount || 0)), 1);
  return (
    <aside className="space-y-4">
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between"><div><h2 className="text-sm font-bold text-slate-900">Department Overview</h2><p className="mt-1 text-xs text-slate-500">Member distribution by department</p></div><BarChart3 className="h-4 w-4 text-indigo-500" /></div>
        <div className="mt-5 space-y-3">
          {departments.slice().sort((a, b) => Number(b.memberCount || 0) - Number(a.memberCount || 0)).slice(0, 8).map((department) => <div key={department._id}><div className="mb-1 flex justify-between text-xs"><span className="font-medium text-slate-700">{department.name}</span><span className="text-slate-500">{department.memberCount || 0}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${Math.max(4, (Number(department.memberCount || 0) / maxMembers) * 100)}%` }} /></div></div>)}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs"><div><span className="block text-slate-400">Departments</span><strong className="mt-1 block text-lg text-slate-900">{departments.length}</strong></div><div><span className="block text-slate-400">Members</span><strong className="mt-1 block text-lg text-slate-900">{totalMembers}</strong></div></div>
      </section>
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
        <div className="flex items-center justify-between"><div><h2 className="text-sm font-bold text-slate-900">Recent Activity</h2><p className="mt-1 text-xs text-slate-500">Department changes and member assignments</p></div><Activity className="h-4 w-4 text-indigo-500" /></div>
        {loading ? <div className="py-8 text-center text-xs text-slate-400">Loading activity...</div> : error ? <div className="mt-4 rounded-xl bg-rose-50 p-4 text-center text-xs text-rose-600">{error}</div> : logs.length ? <div className="mt-4 space-y-4">{logs.slice(0, 5).map((log) => <div key={log._id} className="flex gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600"><Building2 className="h-4 w-4" /></div><div className="min-w-0"><p className="text-xs font-semibold text-slate-800">{actionLabel(log)}</p><p className="mt-0.5 truncate text-[11px] text-slate-500">{log.newValue?.name || log.newValue?.departmentName || log.resourceType || 'Organization department'}</p><p className="mt-1 text-[10px] text-slate-400">{formatRelativeTime(log.timestamp || log.createdAt)}</p></div></div>)}</div> : <div className="mt-4 rounded-xl bg-slate-50 p-5 text-center text-xs text-slate-500"><Users className="mx-auto mb-2 h-5 w-5 text-slate-400" />No department activity has been recorded yet.</div>}
      </section>
    </aside>
  );
}
