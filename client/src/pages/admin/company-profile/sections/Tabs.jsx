import React from 'react'

const profileTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'team', label: 'Team' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'media', label: 'Media' },
  { id: 'contact', label: 'Contact' },
]

export default function Tabs({ activeTab, onChange }) {
  return (
    <nav className="overflow-x-auto border-b border-slate-200" aria-label="Company profile sections">
      <div className="flex min-w-max gap-6">
        {profileTabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`border-b-2 px-0.5 py-3.5 text-sm font-semibold transition ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800'
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
