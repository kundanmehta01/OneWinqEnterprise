import React from 'react'

export default function RecentActivity({ items }){
  if(!items || !items.length) return <div className="text-sm text-gray-500">No recent activity</div>

  return (
    <ul className="space-y-3 text-sm text-gray-600">
      {items.map((it, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">🔔</div>
          <div>
            <div className="font-medium text-gray-800">{it.message ?? it.action ?? 'Activity'}</div>
            <div className="text-xs text-gray-400">{new Date(it.timestamp || it.createdAt || Date.now()).toLocaleString()}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}
