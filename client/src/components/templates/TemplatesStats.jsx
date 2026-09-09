import React from 'react';
import { Layers, CheckCircle2, PauseCircle, Users, Download } from 'lucide-react';
import { StatCard } from '../common/StatCard';

export const TemplatesStats = ({
  totalTemplates = 14,
  activeTemplates = 10,
  inactiveTemplates = 3,
  assignedTemplates = 11,
  totalUsage = 326
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <StatCard
        icon={Layers}
        iconBg="bg-indigo-50 text-indigo-600"
        title="Total Templates"
        value={totalTemplates}
        trendType="neutral"
        trendSubtext="No change"
      />
      <StatCard
        icon={CheckCircle2}
        iconBg="bg-emerald-50 text-emerald-600"
        title="Active Templates"
        value={activeTemplates}
        trend="2"
        trendType="up"
        trendSubtext="vs last month"
      />
      <StatCard
        icon={PauseCircle}
        iconBg="bg-amber-50 text-amber-600"
        title="Inactive Templates"
        value={inactiveTemplates}
        trendType="neutral"
        trendSubtext="No change"
      />
      <StatCard
        icon={Users}
        iconBg="bg-sky-50 text-sky-600"
        title="Assigned Templates"
        value={assignedTemplates}
        trend="1"
        trendType="up"
        trendSubtext="vs last month"
      />
      <StatCard
        icon={Download}
        iconBg="bg-purple-50 text-purple-600"
        title="Total Usage"
        value={totalUsage}
        trend="18"
        trendType="up"
        trendSubtext="vs last month"
      />
    </div>
  );
};
