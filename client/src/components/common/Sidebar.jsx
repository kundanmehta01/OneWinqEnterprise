import React from 'react'
import { Link } from 'react-router-dom'

const sections = [
  { label: 'ORGANIZATION', items: ['Dashboard', 'Company Profile', 'Team Members', 'Departments', 'Roles & Permissions', 'Invitations'] },
  { label: 'PROFILE', items: ['Templates', 'Profile Approval'] },
  { label: 'ANALYTICS', items: ['Analytics', 'Audit Logs'] },
  { label: 'SETTINGS', items: ['General Settings'] }
]

const links = {
  'Dashboard': '/',
  'Company Profile': '/company-profile',
  'Team Members': '/team-members',
  'Departments': '/departments',
  'Roles & Permissions': '/roles-permissions',
  'Invitations': '/invitations',
  'Templates': '/templates',
  'Profile Approval': '/profile-approvals',
  'Analytics': '/analytics',
  'Audit Logs': '/audit-logs',
  'General Settings': '/settings'
}

export default function Sidebar() {
  return (
    <div className="h-screen p-6 flex flex-col justify-between overflow-auto">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-500 rounded-md text-white flex items-center justify-center font-bold">W</div>
          <div>
            <div className="font-semibold text-sm">OneWinq</div>
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
        </div>
        
        <nav className="space-y-6">
          {sections.map(section => (
            <div key={section.label}>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{section.label}</div>
              <div className="space-y-1">
                {section.items.map(item => (
                  <Link key={item} to={links[item]} className="block px-3 py-2 rounded-md hover:bg-purple-100 text-gray-700 text-sm hover:text-purple-600 transition">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="text-xs text-gray-500">
        <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border">
          <div className="font-semibold text-purple-900">OneWinq Enterprise</div>
          <div className="text-green-600">● Active</div>
        </div>
      </div>
    </div>
  )
}
