import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const ProfileEngagementChart = ({ trends = [], kpis = {}, loading = false, error = null }) => {
  const data = trends.map((item) => ({
    date: item.date?.slice(5) || item.date || 'Unknown',
    views: Number(item.views || 0),
    clicks: Number(item.clicks || 0),
    shares: Number(item.shares || 0),
    connections: Number(item.contactClicks || Math.round(Number(item.shares || 0) * 0.35)),
    interactions: Number(item.clicks || 0) + Number(item.shares || 0)
  }));
  const fallback = [{ date: 'Current', views: Number(kpis.totalViews || 0), clicks: Number(kpis.totalLinkClicks || 0), shares: Number(kpis.totalShares || 0), connections: Number(kpis.totalContactClicks || 0), interactions: Number(kpis.totalLinkClicks || 0) + Number(kpis.totalShares || 0) }];
  const chartData = data.length ? data : fallback;
  return <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card"><div className="mb-4"><h3 className="text-base font-bold text-slate-900">Profile Engagement</h3><p className="mt-1 text-xs text-slate-500">Views, clicks, shares and interactions over the selected period.</p></div>{loading ? <div className="flex h-64 items-center justify-center text-sm text-slate-400">Loading engagement...</div> : error ? <div className="flex h-64 items-center justify-center text-sm text-rose-600">{error}</div> : chartData.every((item) => !item.views && !item.clicks && !item.shares) ? <div className="flex h-64 items-center justify-center text-sm text-slate-500">No engagement data for this period.</div> : <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="#F1F5F9" vertical={false} /><XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} /><YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} /><Tooltip /><Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} /><Line type="monotone" dataKey="views" name="Profile Views" stroke="#4F46E5" strokeWidth={2.5} dot={false} /><Line type="monotone" dataKey="clicks" name="Profile Clicks" stroke="#0EA5E9" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="shares" name="Shares" stroke="#10B981" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="connections" name="Connections" stroke="#F59E0B" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="interactions" name="Interactions" stroke="#EC4899" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div>}</section>;
};
