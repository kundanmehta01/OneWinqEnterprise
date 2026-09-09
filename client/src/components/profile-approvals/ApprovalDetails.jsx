import React from 'react';

export const ApprovalDetails = ({ submission }) => {
  if (!submission) return null;
  const snapshot = submission.snapshotData || {};

  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs">
      <div>
        <span className="font-bold text-slate-700 block">Headline</span>
        <p className="text-slate-600">{snapshot.headline || 'None'}</p>
      </div>
      <div>
        <span className="font-bold text-slate-700 block">Bio</span>
        <p className="text-slate-600">{snapshot.bio || 'None'}</p>
      </div>
    </div>
  );
};
