import React, { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsHeader } from '../../components/analytics/AnalyticsHeader';
import { AnalyticsTabs } from '../../components/analytics/AnalyticsTabs';
import { AnalyticsKpiCards } from '../../components/analytics/AnalyticsKpiCards';
import { ProfileViewsChart } from '../../components/analytics/ProfileViewsChart';
import { TopViewedProfilesCard } from '../../components/analytics/TopViewedProfilesCard';
import { TrafficSourceCard } from '../../components/analytics/TrafficSourceCard';
import { EngagementFunnelCard } from '../../components/analytics/EngagementFunnelCard';
import { TopTemplatesCard } from '../../components/analytics/TopTemplatesCard';
import { DeviceDonutCard } from '../../components/analytics/DeviceDonutCard';
import { ProfileEngagementChart } from '../../components/analytics/ProfileEngagementChart';
import { Info, Clock } from 'lucide-react';

export const AnalyticsPage = () => {
  const { analytics, range, setRange, dates, setDates, loading, error } = useAnalytics();
  const [activeTab, setActiveTab] = useState('overview');

  const kpis = analytics?.kpis || {};
  const trends = analytics?.trends || [];
  const topProfiles = analytics?.topViewedProfiles || [];
  const templateUsage = analytics?.templateUsage || [];

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analytics || {}, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `onewinq_analytics_${range}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <AnalyticsHeader onExport={handleExport} />

      <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
        <label className="text-xs font-semibold text-slate-600">
          <span className="mb-1 block">Date range</span>
          <select
            value={range}
            onChange={(event) => setRange(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="custom">Custom range</option>
          </select>
        </label>
        {range === 'custom' && (
          <>
            <label className="text-xs font-semibold text-slate-600">
              <span className="mb-1 block">Start date</span>
              <input
                type="date"
                value={dates.startDate || ''}
                onChange={(event) => setDates((current) => ({ ...current, startDate: event.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              <span className="mb-1 block">End date</span>
              <input
                type="date"
                value={dates.endDate || ''}
                onChange={(event) => setDates((current) => ({ ...current, endDate: event.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
              />
            </label>
          </>
        )}
      </div>

      <AnalyticsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Row 1: 5 KPI Cards with Sparklines */}
      <AnalyticsKpiCards kpis={kpis} />

      {/* Row 2: Profile Views Trend + Top Viewed Profiles + Traffic Source Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <ProfileViewsChart trends={trends} loading={loading} error={error} />
        </div>
        <div className="lg:col-span-4">
          <TopViewedProfilesCard topProfiles={topProfiles} />
        </div>
        <div className="lg:col-span-3">
          <TrafficSourceCard kpis={kpis} loading={loading} />
        </div>
      </div>

      {/* Row 3: Funnel Chart + Top Performing Templates + Engagement by Device */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <EngagementFunnelCard kpis={kpis} />
        </div>
        <div className="lg:col-span-4">
          <TopTemplatesCard templateUsage={templateUsage} />
        </div>
        <div className="lg:col-span-4">
          <DeviceDonutCard kpis={kpis} loading={loading} />
        </div>
      </div>
      <ProfileEngagementChart trends={trends} kpis={kpis} loading={loading} error={error} />

      {/* Bottom Notice & Real-time timestamp */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>All analytics are updated in real-time. Data shown is based on organization profiles.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Data timezone: IST (UTC +05:30)</span>
        </div>
      </div>
    </div>
  );
};
