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
import { Info, Clock } from 'lucide-react';

export const AnalyticsPage = () => {
  const { analytics, range, setRange, loading } = useAnalytics();
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

      <AnalyticsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Row 1: 5 KPI Cards with Sparklines */}
      <AnalyticsKpiCards kpis={kpis} />

      {/* Row 2: Profile Views Trend + Top Viewed Profiles + Traffic Source Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <ProfileViewsChart trends={trends} />
        </div>
        <div className="lg:col-span-4">
          <TopViewedProfilesCard topProfiles={topProfiles} />
        </div>
        <div className="lg:col-span-3">
          <TrafficSourceCard />
        </div>
      </div>

      {/* Row 3: Funnel Chart + Top Performing Templates + Engagement by Device */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <EngagementFunnelCard />
        </div>
        <div className="lg:col-span-4">
          <TopTemplatesCard templateUsage={templateUsage} />
        </div>
        <div className="lg:col-span-4">
          <DeviceDonutCard />
        </div>
      </div>

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
