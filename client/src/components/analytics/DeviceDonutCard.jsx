import React from 'react';

export const DeviceDonutCard = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
      <h3 className="text-base font-bold text-slate-900 mb-3">Engagement by Device</h3>

      <div className="flex min-h-36 items-center justify-center text-center text-sm text-slate-500">
        Device breakdown is not included in the current analytics response.
      </div>
    </div>
  );
};
