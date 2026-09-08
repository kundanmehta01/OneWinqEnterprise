import React, { useState } from 'react'
import { useAnalytics } from '../../hooks/useAnalytics'

export default function Analytics(){
  const [range, setRange] = useState('7d')
  const { data, loading, error } = useAnalytics(range)
  const [tab, setTab] = useState('overview')

  if(loading) return <div>Loading...</div>
  if(error) return <div className="text-red-500">Error loading analytics</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="header-title">Analytics</h1>
          <p className="text-gray-600">Track and analyze your organization's profile performance and engagement.</p>
        </div>
        <select value={range} onChange={e => setRange(e.target.value)} className="border rounded px-3 py-2">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      <div className="flex border-b bg-white rounded-t-xl border-x">
        {['Overview', 'Profile Views', 'Profile Shares', 'QR Scans', 'Link Clicks', 'Engagement'].map(t => (
          <button key={t} onClick={() => setTab(t.toLowerCase().replace(' ', '-'))} className={`px-4 py-3 border-b-2 ${tab === t.toLowerCase().replace(' ', '-') ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-b-xl border border-t-0 p-6">
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-5 gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Profile Views</div>
                <div className="text-2xl font-semibold">{data?.profileViews ?? 0}</div>
                <div className="text-xs text-green-600">+18.5% vs last period</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Profile Shares</div>
                <div className="text-2xl font-semibold">{data?.profileShares ?? 0}</div>
                <div className="text-xs text-green-600">+14.2% vs last period</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">QR Scans</div>
                <div className="text-2xl font-semibold">{data?.qrScans ?? 0}</div>
                <div className="text-xs text-green-600">+21.3% vs last period</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Link Clicks</div>
                <div className="text-2xl font-semibold">{data?.linkClicks ?? 0}</div>
                <div className="text-xs text-green-600">+16.8% vs last period</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Active Members</div>
                <div className="text-2xl font-semibold">{data?.activeMembers ?? 0}</div>
                <div className="text-xs text-green-600">+9.5% vs last period</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Top Viewed Profiles</h4>
                <div className="space-y-3">
                  {data?.topProfiles?.map((p, i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-gray-500">{p.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{p.views}</div>
                        <div className="text-xs text-green-600">+{p.change}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Top Performing Templates</h4>
                <div className="space-y-3">
                  {data?.topTemplates?.map((t, i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-sm text-gray-500">{t.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{t.views}</div>
                        <div className="text-xs text-green-600">+{t.change}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
