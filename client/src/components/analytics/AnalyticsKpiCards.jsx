import React from 'react';
import { Eye, Share2, QrCode, Link2, Users } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { formatNumber } from '../../utils/formatNumber';

const MiniSparkline = ({ color = '#6366F1' }) => (
  <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible">
    <path
      d="M0 20 Q 25 18, 40 10 T 70 12 T 100 4"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const AnalyticsKpiCards = ({ kpis = {} }) => {
  const views = kpis.totalViews ?? 12842;
  const shares = kpis.totalShares ?? 3276;
  const scans = kpis.totalQrScans ?? 1487;
  const clicks = kpis.totalLinkClicks ?? 2953;
  const members = 126;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard
        icon={Eye}
        iconBg="bg-indigo-50 text-indigo-600"
        title="Profile Views"
        value={formatNumber(views)}
        trend="18.6%"
        trendType="up"
        trendSubtext="vs May 11 – May 17"
        sparkline={<MiniSparkline color="#6366F1" />}
      />

      <StatCard
        icon={Share2}
        iconBg="bg-emerald-50 text-emerald-600"
        title="Profile Shares"
        value={formatNumber(shares)}
        trend="14.2%"
        trendType="up"
        trendSubtext="vs May 11 – May 17"
        sparkline={<MiniSparkline color="#10B981" />}
      />

      <StatCard
        icon={QrCode}
        iconBg="bg-amber-50 text-amber-600"
        title="QR Scans"
        value={formatNumber(scans)}
        trend="21.3%"
        trendType="up"
        trendSubtext="vs May 11 – May 17"
        sparkline={<MiniSparkline color="#F59E0B" />}
      />

      <StatCard
        icon={Link2}
        iconBg="bg-sky-50 text-sky-600"
        title="Link Clicks"
        value={formatNumber(clicks)}
        trend="16.8%"
        trendType="up"
        trendSubtext="vs May 11 – May 17"
        sparkline={<MiniSparkline color="#0EA5E9" />}
      />

      <StatCard
        icon={Users}
        iconBg="bg-purple-50 text-purple-600"
        title="Active Members"
        value={formatNumber(members)}
        trend="9.5%"
        trendType="up"
        trendSubtext="vs May 11 – May 17"
        sparkline={<MiniSparkline color="#8B5CF6" />}
      />
    </div>
  );
};
