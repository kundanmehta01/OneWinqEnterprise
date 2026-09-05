import React, { useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAnalytics } from '../../hooks/useAnalytics'

export default function Analytics() {
  const [range, setRange] = useState('7d')
  const { data, loading, error } = useAnalytics(range)
  const [tab, setTab] = useState('overview')

  const kpis = data?.kpis || {}
  const chartData = useMemo(
    () =>
      (data?.trends || []).map((item) => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: Number(item.views || 0),
        shares: Number(item.shares || 0),
        scans: Number(item.scans || 0),
        clicks: Number(item.clicks || 0),
      })),
    [data]
  )

  const summaryCards = [
    { label: 'Profile Views', value: kpis.totalViews || 0 },
    { label: 'Profile Shares', value: kpis.totalShares || 0 },
    { label: 'QR Scans', value: kpis.totalQrScans || 0 },
    { label: 'Link Clicks', value: kpis.totalLinkClicks || 0 },
    { label: 'Contact Clicks', value: kpis.totalContactClicks || 0 },
  ]

  if (loading) return <div className="rounded-xl border bg-white p-8 text-slate-600">Loading analytics...</div>
  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">Error loading analytics data.</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-600">Track profile performance, engagement, and scan activity across the organization.</p>
        </div>
        <select value={range} onChange={(event) => setRange(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-500">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="today">Today</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-white px-2 pt-2">
        {['overview', 'views', 'shares', 'scans', 'clicks'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-t-lg border-b-2 px-4 py-2 text-sm font-medium ${tab === item ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
          >
            {item === 'overview' ? 'Overview' : item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">{card.label}</div>
                  <div className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</div>
                </div>
              ))}
            </div>

            {chartData.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                No analytics data is available for the selected time range.
              </div>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="viewsFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#64748b" />
                    <YAxis tickLine={false} axisLine={false} stroke="#64748b" />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#viewsFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="mb-4 text-lg font-semibold text-slate-900">Top viewed profiles</h4>
                {!(data?.topViewedProfiles || []).length ? (
                  <p className="text-sm text-slate-500">No profile view activity yet.</p>
                ) : (
                  <div className="space-y-3">
                    {(data?.topViewedProfiles || []).map((profile) => (
                      <div key={profile.memberId} className="flex items-center justify-between border-b border-slate-200 pb-2 last:border-b-0">
                        <div>
                          <div className="font-medium text-slate-900">{profile.name}</div>
                          <div className="text-xs text-slate-500">{profile.designation || profile.department || 'Profile'}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">{profile.views}</div>
                          <div className="text-xs text-emerald-600">views</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <h4 className="mb-4 text-lg font-semibold text-slate-900">Top templates</h4>
                {!(data?.templateUsage || []).length ? (
                  <p className="text-sm text-slate-500">No template performance data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {(data?.templateUsage || []).slice(0, 5).map((template) => (
                      <div key={template._id || template.name} className="flex items-center justify-between border-b border-slate-200 pb-2 last:border-b-0">
                        <div>
                          <div className="font-medium text-slate-900">{template.name}</div>
                          <div className="text-xs text-slate-500">{template.category || 'General'}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">{template.profileCount || 0}</div>
                          <div className="text-xs text-violet-600">usage</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'views' && (
          <div className="h-80 w-full">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">No profile view data.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#64748b" />
                  <YAxis tickLine={false} axisLine={false} stroke="#64748b" />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {tab === 'shares' && (
          <div className="h-80 w-full">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">No share data.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#64748b" />
                  <YAxis tickLine={false} axisLine={false} stroke="#64748b" />
                  <Tooltip />
                  <Area type="monotone" dataKey="shares" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {tab === 'scans' && (
          <div className="h-80 w-full">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">No QR scan data.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#64748b" />
                  <YAxis tickLine={false} axisLine={false} stroke="#64748b" />
                  <Tooltip />
                  <Area type="monotone" dataKey="scans" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {tab === 'clicks' && (
          <div className="h-80 w-full">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">No link click data.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="#64748b" />
                  <YAxis tickLine={false} axisLine={false} stroke="#64748b" />
                  <Tooltip />
                  <Area type="monotone" dataKey="clicks" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
