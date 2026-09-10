import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart2,
  Calendar,
  Download,
  Eye,
  Share2,
  QrCode,
  Link as LinkIcon,
  Users,
  ChevronDown,
  Info,
  TrendingUp,
  Loader2,
  ArrowUpRight
} from 'lucide-react';
import { analyticsApi } from '../../api/analyticsApi';
import { KpiCard } from '../../components/common/KpiCard';

export const AdminAnalyticsPage = () => {
  const [activeFilterPill, setActiveFilterPill] = useState('Overview');
  const [selectedRange, setSelectedRange] = useState('7d');
  const [hoveredTrend, setHoveredTrend] = useState(null);

  const { data: analyticsResponse, isLoading } = useQuery({
    queryKey: ['admin-analytics', selectedRange, activeFilterPill],
    queryFn: async () => {
      const res = await analyticsApi.getMetrics({ range: selectedRange });
      return res?.data || res;
    }
  });

  const analyticsData = analyticsResponse || {};
  const kpis = analyticsData.kpis || {
    totalViews: 0,
    totalShares: 0,
    totalQrScans: 0,
    totalLinkClicks: 0,
    totalContactClicks: 0,
    activeMembers: 0
  };

  const trends = analyticsData.trends || [];
  const topProfiles = (analyticsData.topViewedProfiles || []).map((p) => ({
    name: p.name || 'Team Member',
    role: p.designation || p.department || 'Employee',
    views: Number(p.views || 0).toLocaleString(),
    avatar: p.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'Member')}&background=6366f1&color=fff`
  }));

  const trafficSources = analyticsData.trafficSources || [];
  const funnelStages = analyticsData.funnel || [];
  const topTemplates = analyticsData.topTemplates || [];
  const deviceBreakdown = analyticsData.deviceBreakdown || [];

  // Dynamic Date Range string based on selected range and current date
  const dateRangeLabel = useMemo(() => {
    const end = new Date();
    const start = new Date();
    if (selectedRange === 'today') {
      return end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } else if (selectedRange === '30d') {
      start.setDate(end.getDate() - 29);
    } else if (selectedRange === '90d') {
      start.setDate(end.getDate() - 89);
    } else if (selectedRange === 'month') {
      start.setDate(1);
    } else if (selectedRange === 'year') {
      start.setMonth(0, 1);
    } else {
      start.setDate(end.getDate() - 6);
    }
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }, [selectedRange]);

  const filterPills = ['Overview', 'Profile Views', 'Profile Shares', 'QR Scans', 'Link Clicks'];

  // Calculate SVG Trend points
  const maxTrendViews = Math.max(1, ...trends.map((t) => t.views || 0));
  const trendPoints = trends.length > 0
    ? trends.map((t, idx) => {
        const x = trends.length === 1 ? 160 : 20 + (idx / (trends.length - 1)) * 280;
        const normalized = Math.min(1, Math.max(0, (t.views || 0) / maxTrendViews));
        const y = 120 - normalized * 90;
        return { date: t.date, views: t.views || 0, x, y };
      })
    : [
        { date: 'Start', views: 0, x: 20, y: 120 },
        { date: 'Today', views: 0, x: 300, y: 120 }
      ];

  const trendPathD = trendPoints.length > 1
    ? `M ${trendPoints.map((p) => `${p.x} ${p.y}`).join(' L ')}`
    : `M 20 120 L 300 120`;

  // Dynamic Donut calculations
  const circ = 2 * Math.PI * 38; // ~238.76

  // Traffic sources segments
  const totalSourcesCount = Math.max(1, trafficSources.reduce((sum, s) => sum + (s.count || 0), 0));
  let sourceOffsetAcc = 0;
  const sourceSegments = trafficSources.map((s) => {
    const strokeLen = ((s.count || 0) / totalSourcesCount) * circ;
    const offset = -sourceOffsetAcc;
    sourceOffsetAcc += strokeLen;
    return { ...s, strokeLen, offset };
  });

  // Device breakdown segments
  const totalDeviceCount = Math.max(1, deviceBreakdown.reduce((sum, d) => sum + (d.count || 0), 0));
  let devOffsetAcc = 0;
  const deviceSegments = deviceBreakdown.map((d) => {
    const strokeLen = ((d.count || 0) / totalDeviceCount) * circ;
    const offset = -devOffsetAcc;
    devOffsetAcc += strokeLen;
    return { ...d, strokeLen, offset };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* 1. Header with Dynamic Range Filter & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry and engagement metrics for enterprise profiles and smart cards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Dynamic Range Dropdown */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <div className="hidden md:flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-500">
            {dateRangeLabel}
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterPills.map((pill) => (
          <button
            key={pill}
            onClick={() => setActiveFilterPill(pill)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilterPill === pill
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* 3. 5 Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          icon={Eye}
          iconBg="bg-indigo-50 text-indigo-600"
          title="Profile Views"
          value={kpis.totalViews.toLocaleString()}
          trend={trends.length > 0 ? `${trends[trends.length - 1]?.views || 0} today` : '0'}
          trendType="up"
          trendLabel="in selected window"
          sparklineData={trends.map((t) => t.views || 0)}
          sparklineColor="#6366f1"
        />
        <KpiCard
          icon={Share2}
          iconBg="bg-emerald-50 text-emerald-600"
          title="Profile Shares"
          value={kpis.totalShares.toLocaleString()}
          trend={trends.length > 0 ? `${trends[trends.length - 1]?.shares || 0} today` : '0'}
          trendType="up"
          trendLabel="in selected window"
          sparklineData={trends.map((t) => t.shares || 0)}
          sparklineColor="#10b981"
        />
        <KpiCard
          icon={QrCode}
          iconBg="bg-amber-50 text-amber-600"
          title="QR Scans"
          value={kpis.totalQrScans.toLocaleString()}
          trend={trends.length > 0 ? `${trends[trends.length - 1]?.scans || 0} today` : '0'}
          trendType="up"
          trendLabel="in selected window"
          sparklineData={trends.map((t) => t.scans || 0)}
          sparklineColor="#f59e0b"
        />
        <KpiCard
          icon={LinkIcon}
          iconBg="bg-blue-50 text-blue-600"
          title="Link Clicks"
          value={kpis.totalLinkClicks.toLocaleString()}
          trend={trends.length > 0 ? `${trends[trends.length - 1]?.clicks || 0} today` : '0'}
          trendType="up"
          trendLabel="in selected window"
          sparklineData={trends.map((t) => t.clicks || 0)}
          sparklineColor="#38bdf8"
        />
        <KpiCard
          icon={Users}
          iconBg="bg-purple-50 text-purple-600"
          title="Active Members"
          value={kpis.activeMembers.toLocaleString()}
          trend="Live"
          trendType="up"
          trendLabel="enterprise directory"
          sparklineData={[kpis.activeMembers, kpis.activeMembers]}
          sparklineColor="#8b5cf6"
        />
      </div>

      {/* 4. Row 1: Views Over Time + Top Profiles + Traffic Source */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views Line Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-900">Profile Views Over Time</h2>
            <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
              {dateRangeLabel}
            </span>
          </div>

          {/* Dynamic SVG Chart */}
          <div className="h-56 relative w-full pt-4">
            {hoveredTrend && (
              <div
                className="absolute z-10 bg-white border border-slate-100 shadow-md rounded-lg px-2.5 py-1 text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-150"
                style={{ left: `${(hoveredTrend.x / 320) * 100}%`, top: `${(hoveredTrend.y / 140) * 100}%` }}
              >
                <p className="text-[10px] text-slate-400 font-medium">{hoveredTrend.date}</p>
                <p className="text-xs font-bold text-indigo-600">{hoveredTrend.views} Views</p>
              </div>
            )}

            <svg viewBox="0 0 320 140" className="w-full h-full overflow-visible">
              <line x1="0" y1="30" x2="320" y2="30" stroke="#f1f5f9" />
              <line x1="0" y1="70" x2="320" y2="70" stroke="#f1f5f9" />
              <line x1="0" y1="110" x2="320" y2="110" stroke="#f1f5f9" />
              <line x1="0" y1="130" x2="320" y2="130" stroke="#e2e8f0" />

              <path
                d={trendPathD}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {trendPoints.map((pt, pIdx) => (
                <circle
                  key={pIdx}
                  cx={pt.x}
                  cy={pt.y}
                  r={pIdx === trendPoints.length - 1 ? 4.5 : 3.5}
                  fill={pIdx === trendPoints.length - 1 ? '#4f46e5' : '#6366f1'}
                  stroke="#ffffff"
                  strokeWidth={pIdx === trendPoints.length - 1 ? 2 : 0}
                  className="cursor-pointer hover:r-5 transition-all"
                  onMouseEnter={() => setHoveredTrend(pt)}
                  onMouseLeave={() => setHoveredTrend(null)}
                />
              ))}
            </svg>

            <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
              {trendPoints.filter((_, i) => i === 0 || i === Math.floor(trendPoints.length / 2) || i === trendPoints.length - 1).map((pt, idx) => (
                <span key={idx}>{pt.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Top Viewed Profiles */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Top Viewed Profiles</h2>
              <span className="text-[10px] font-semibold text-slate-400">Ranked by Views</span>
            </div>

            {topProfiles.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                No profile views recorded in this period yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-50 text-xs">
                {topProfiles.slice(0, 5).map((p, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{p.views}</p>
                      <p className="text-[10px] text-indigo-600 font-semibold">views</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Traffic Source Donut */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-900">Traffic Source Breakdown</h2>

          <div className="relative flex items-center justify-center my-3">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
              {sourceSegments.map((s, idx) => (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke={s.color || '#6366f1'}
                  strokeWidth="12"
                  strokeDasharray={`${s.strokeLen} ${circ}`}
                  strokeDashoffset={s.offset}
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-slate-900">{kpis.totalViews.toLocaleString()}</span>
              <span className="text-[9px] text-slate-400 font-medium">Total Views</span>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-100">
            {trafficSources.map((ts, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ts.color }}></span> {ts.source || ts.name}
                </span>
                <span className="font-semibold text-slate-800">
                  {ts.count} ({ts.percentage || ts.pct || 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Row 2: Engagement Funnel + Top Templates + Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Funnel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-900 mb-3">Profile Engagement Funnel</h2>

          <div className="space-y-3 my-2">
            {funnelStages.map((fs, idx) => {
              const maxCount = Math.max(1, funnelStages[0]?.count || 1);
              const pctWidth = Math.max(10, Math.round(((fs.count || 0) / maxCount) * 100));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 font-medium text-[11px]">{fs.stage || fs.name}</span>
                    <span className="font-bold text-slate-900 text-[11px]">
                      {Number(fs.count || 0).toLocaleString()} <span className="text-slate-400 font-normal">{fs.rate}</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className="h-2.5 rounded-full bg-indigo-600 transition-all duration-500" style={{ width: `${pctWidth}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Templates */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Active Profile Templates</h2>
              <span className="text-[10px] text-slate-400">Adopted by Members</span>
            </div>

            {topTemplates.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                No templates configured yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-50 text-xs">
                {topTemplates.slice(0, 5).map((tpl, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-8 rounded border border-slate-200 bg-indigo-50 flex flex-col overflow-hidden shrink-0">
                        <div className="h-2 w-full bg-indigo-600"></div>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-[11px]">{tpl.name}</p>
                        <p className="text-[10px] text-slate-400">{tpl.category || 'Professional'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{tpl.usage || 0}</p>
                      <p className="text-[10px] text-slate-400">profiles</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Engagement by Device */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-900">Device Breakdown</h2>

          <div className="relative flex items-center justify-center my-3">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
              {deviceSegments.map((d, idx) => (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke={d.color || '#6366f1'}
                  strokeWidth="12"
                  strokeDasharray={`${d.strokeLen} ${circ}`}
                  strokeDashoffset={d.offset}
                  strokeLinecap="round"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-slate-900">{kpis.totalViews.toLocaleString()}</span>
              <span className="text-[9px] text-slate-400 font-medium">Total Views</span>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-100">
            {deviceBreakdown.map((dev, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dev.color }}></span> {dev.device || dev.name}
                </span>
                <span className="font-semibold text-slate-800">
                  {dev.count} ({dev.percentage || dev.pct || 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Footer Real-time info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>Telemetric events are recorded on digital identity views, card taps, and QR scans.</span>
        </div>
        <span>Timezone: Local / UTC</span>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
