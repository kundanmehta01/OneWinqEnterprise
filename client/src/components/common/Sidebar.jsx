import React from 'react'

const items = [
  'Dashboard',
  'Company Profile',
  'Team Members',
  'Departments',
  'Roles & Permissions',
  'Invitations',
  'Templates',
  'Profile Approval',
  'Analytics',
  'Audit Logs',
  'Settings',
]

export default function Sidebar() {
  return (
    <div className="h-full p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-md text-white flex items-center justify-center font-bold">W</div>
          <div>
            <div className="font-semibold">OneWinq</div>
            <div className="text-sm text-gray-400">Admin Panel</div>
          </div>
        </div>
        <nav className="space-y-2">
          {items.map((it) => (
            <a key={it} href="#" className="block px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700">
              {it}
            </a>
          ))}
        </nav>
      </div>

      <div className="text-sm text-gray-500">
        <div className="p-3 bg-white rounded-lg shadow-sm">OneWinq Enterprise<br/><span className="text-green-500">Active</span></div>
      </div>
    </div>
  )
}
