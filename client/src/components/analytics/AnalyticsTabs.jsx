import React from 'react';

export const AnalyticsTabs = ({ activeTab = 'overview', onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'views', label: 'Profile Views' },
    { id: 'shares', label: 'Profile Shares' },
    { id: 'scans', label: 'QR Scans' },
    { id: 'clicks', label: 'Link Clicks' },
    { id: 'engagement', label: 'Engagement' }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 mb-6 -mx-1 px-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/70'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
