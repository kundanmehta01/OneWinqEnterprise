import React from 'react';

export default function CompanyTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <div className="flex min-w-max">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" onClick={() => onChange(tab.id)} className={`border-b-2 px-4 py-3 text-xs font-semibold transition ${activeTab === tab.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
