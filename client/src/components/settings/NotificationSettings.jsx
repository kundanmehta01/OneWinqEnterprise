import React from 'react';

export const NotificationSettings = ({ settings = {}, onChange }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Email Notifications</h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(settings.notifications?.emailOnApprovalRequest)}
            onChange={(e) => onChange('notifications', { ...settings.notifications, emailOnApprovalRequest: e.target.checked })}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>Notify admins when a team member submits a profile review request</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(settings.notifications?.emailOnMemberJoin)}
            onChange={(e) => onChange('notifications', { ...settings.notifications, emailOnMemberJoin: e.target.checked })}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span>Notify when an invited member activates their account</span>
        </label>
      </div>
    </div>
  );
};
