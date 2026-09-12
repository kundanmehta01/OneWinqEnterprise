import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  FileText,
  Calendar,
  ChevronDown,
  FolderTree,
  FileEdit,
  ShieldCheck,
  Send
} from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import { KpiCard } from '../../components/common/KpiCard';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [growthFilter, setGrowthFilter] = useState('This Month');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.getDashboard();
      return res.data || res;
    }
  });

  const now = new Date();
  const start7d = new Date();
  start7d.setDate(start7d.getDate() - 6);
  const timeRange = `${start7d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const overview = dashboardData?.overview || {
    totalMembers: 0,
    activeMembers: 0,
    totalDepartments: 0,
    achievementsCount: 0,
    updatesCount: 0
  };

  const completion = dashboardData?.profileCompletionBreakdown || {
    completed: overview.activeMembers || 0,
    inProgress: Math.max(0, (overview.totalMembers || 0) - (overview.activeMembers || 0)),
    pendingApproval: overview.pendingApprovalsCount || 0,
    total: Math.max(1, overview.totalMembers || 1)
  };

  const rawGrowthTrends = dashboardData?.growthTrends || [];
  const maxCount = Math.max(1, ...rawGrowthTrends.map((g) => g.count || 0), overview.totalMembers || 1);

  // Dynamically map growth trends to SVG coordinate space [0, 500] x [0, 160]
  const growthPoints = rawGrowthTrends.length > 0
    ? rawGrowthTrends.map((g, idx) => {
        const x = rawGrowthTrends.length === 1 ? 250 : 30 + (idx / (rawGrowthTrends.length - 1)) * 440;
        const normalized = Math.min(1, Math.max(0, (g.count || 0) / maxCount));
        const y = 140 - normalized * 110;
        return { date: g.date, count: g.count || 0, x, y };
      })
    : [
        { date: 'Day 1', count: 0, x: 30, y: 140 },
        { date: 'Today', count: overview.totalMembers, x: 470, y: 30 }
      ];

  const svgPathD = growthPoints.length > 1
    ? `M ${growthPoints.map((p) => `${p.x} ${p.y}`).join(' L ')}`
    : `M 30 140 L 470 140`;

  const svgAreaD = growthPoints.length > 1
    ? `${svgPathD} L ${growthPoints[growthPoints.length - 1].x} 150 L ${growthPoints[0].x} 150 Z`
    : `M 30 140 L 470 140 L 470 150 L 30 150 Z`;

  const totalComp = Math.max(1, completion.total || 1);
  const circ = 2 * Math.PI * 38; // ~238.76
  const compLen = (completion.completed / totalComp) * circ;
  const inProgLen = (completion.inProgress / totalComp) * circ;
  const pendLen = (completion.pendingApproval / totalComp) * circ;

  const quickActions = [
    {
      title: 'Company Profile',
      desc: 'Manage company information',
      icon: Building2,
      path: '/admin/company-profile',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Team Members',
      desc: 'View and manage members',
      icon: Users,
      path: '/admin/team',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      title: 'Departments',
      desc: 'Create and manage departments',
      icon: FolderTree,
      path: '/admin/departments',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Templates',
      desc: 'Manage profile templates',
      icon: FileEdit,
      path: '/admin/templates',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      title: 'Profile Approval',
      desc: 'Review and approve profiles',
      icon: ShieldCheck,
      path: '/admin/approvals',
      color: 'bg-rose-50 text-rose-600'
    },
    {
      title: 'Invitations',
      desc: 'Invite new members to join',
      icon: Send,
      path: '/admin/invitations',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const recentLogs = dashboardData?.recentActivity || [];
  const recentActivities = recentLogs.length > 0 ? recentLogs.map((log) => ({
    title: log.title || `${log.action || 'Updated'} in ${log.module || 'system'}`,
    author: log.department || log.actorId?.email || 'Organization',
    time: log.timestamp ? new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recently',
    icon: Building2,
    color: 'bg-indigo-50 text-indigo-600'
  })) : [
    {
      title: 'Enterprise Organization Initialized',
      author: 'OneWinq Enterprise',
      time: 'Active',
      icon: Building2,
      color: 'bg-indigo-50 text-indigo-600'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with Title & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, Super Admin! Here's what's happening with OneWing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>
        </div>
      </div>

      {/* 2. 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          icon={Users}
          iconBg="bg-indigo-50 text-indigo-600"
          title="Total Members"
          value={overview.totalMembers}
          trend=""
          trendType="neutral"
          trendLabel="Active team members"
        />
        <KpiCard
          icon={FolderTree}
          iconBg="bg-emerald-50 text-emerald-600"
          title="Departments"
          value={overview.totalDepartments}
          trend=""
          trendType="neutral"
          trendLabel="Configured departments"
        />
        <KpiCard
          icon={FileText}
          iconBg="bg-amber-50 text-amber-600"
          title="Active Profiles"
          value={overview.activeMembers}
          trend=""
          trendType="neutral"
          trendLabel="Published digital profiles"
        />
      </div>

      {/* 3. Growth Chart & Profile Completion Donut Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Members Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Members Growth</h2>
            </div>
            <select
              value={growthFilter}
              onChange={(e) => setGrowthFilter(e.target.value)}
              className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>

          {/* SVG Area Chart */}
          <div className="relative h-64 w-full pt-4">
            {/* Tooltip Overlay */}
            {hoveredPoint && (
              <div
                className="absolute z-10 bg-white border border-slate-100 shadow-md rounded-lg px-3 py-1.5 text-xs pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all duration-150"
                style={{ left: `${(hoveredPoint.x / 500) * 100}%`, top: `${(hoveredPoint.y / 160) * 100}%` }}
              >
                <p className="text-[10px] text-slate-400 font-medium">{hoveredPoint.date}</p>
                <p className="text-xs font-bold text-indigo-600 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                  Joined Members: {hoveredPoint.count}
                </p>
              </div>
            )}

            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" />

              {/* Dynamic Area Fill */}
              <path d={svgAreaD} fill="url(#growthGradient)" />

              {/* Dynamic Smooth Stroke Line */}
              <path
                d={svgPathD}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {growthPoints.map((pt, pIdx) => (
                <circle
                  key={pIdx}
                  cx={pt.x}
                  cy={pt.y}
                  r={pIdx === growthPoints.length - 1 ? 5 : 4}
                  fill={pIdx === growthPoints.length - 1 ? '#4f46e5' : '#6366f1'}
                  stroke="#ffffff"
                  strokeWidth={pIdx === growthPoints.length - 1 ? 2 : 0}
                  className="cursor-pointer hover:r-6 transition-all"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}
            </svg>

            {/* Dynamic X-Axis Labels */}
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 px-2">
              {growthPoints.map((pt, pIdx) => (
                <span key={pIdx} className="truncate px-1">
                  {pt.date}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Profile Completion Overview Donut */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Profile Completion Overview</h2>
          </div>

          <div className="relative flex items-center justify-center my-4">
            <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
              {/* Completed slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#6366f1"
                strokeWidth="12"
                strokeDasharray={`${compLen} ${circ}`}
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* In Progress slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth="12"
                strokeDasharray={`${inProgLen} ${circ}`}
                strokeDashoffset={-compLen}
                strokeLinecap="round"
              />
              {/* Pending Approval slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#38bdf8"
                strokeWidth="12"
                strokeDasharray={`${pendLen} ${circ}`}
                strokeDashoffset={-(compLen + inProgLen)}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">{completion.completed}</span>
              <span className="text-[11px] text-slate-400 font-medium">Completed</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Completed
              </span>
              <span className="font-semibold text-slate-800">
                {completion.completed} ({Math.round((completion.completed / completion.total) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> In Progress
              </span>
              <span className="font-semibold text-slate-800">
                {completion.inProgress} ({Math.round((completion.inProgress / completion.total) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Pending Approval
              </span>
              <span className="font-semibold text-slate-800">
                {completion.pendingApproval} ({Math.round((completion.pendingApproval / completion.total) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-slate-400 text-[11px]">
              <span>Total Profiles</span>
              <span className="font-semibold text-slate-700">{completion.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Activity & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Activity Feed */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
            <button
              onClick={() => navigate('/admin/team')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View Team
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {recentActivities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="py-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${act.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{act.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">by {act.author}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: 6 Quick Actions Grid */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((qa, idx) => {
              const Icon = qa.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(qa.path)}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/70 text-left transition-all group"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${qa.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                      {qa.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{qa.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
