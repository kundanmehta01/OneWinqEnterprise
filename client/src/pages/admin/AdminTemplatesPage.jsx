import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  CheckCircle2,
  PauseCircle,
  Users,
  Download,
  Search,
  SlidersHorizontal,
  Plus,
  MoreHorizontal,
  Eye,
  Edit3,
  Layers,
  Sparkles,
  ChevronDown,
  Shield,
  Briefcase,
  MapPin,
  Mail,
  Loader2,
  Trash2
} from 'lucide-react';
import { templateApi } from '../../api/templateApi';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusBadge } from '../../components/common/BadgePill';
import { Pagination } from '../../components/common/Pagination';

export const AdminTemplatesPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const { data: templatesResponse, isLoading } = useQuery({
    queryKey: ['admin-templates'],
    queryFn: async () => {
      const res = await templateApi.getAll();
      return res?.data || [];
    }
  });

  const templatesList = templatesResponse || [];

  useEffect(() => {
    if (templatesList.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(templatesList[0]._id);
    }
  }, [templatesList, selectedTemplateId]);

  const selectedTemplate = templatesList.find((t) => t._id === selectedTemplateId) || templatesList[0];

  const filteredTemplates = templatesList.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = templatesList.filter((t) => t.isActive !== false).length;
  const inactiveCount = templatesList.filter((t) => t.isActive === false).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Templates</h1>
          <p className="text-xs text-slate-500 mt-1">Create, manage and assign profile templates for your organization.</p>
        </div>
      </div>

      {/* 2. 4 KPI Summary Cards (Dynamic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={FileText}
          iconBg="bg-indigo-50 text-indigo-600"
          title="Total Templates"
          value={templatesList.length}
          trend=""
          trendType="neutral"
          trendLabel="All system & custom templates"
        />
        <KpiCard
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
          title="Active Templates"
          value={activeCount}
          trend=""
          trendType="neutral"
          trendLabel="Available for assignment"
        />
        <KpiCard
          icon={PauseCircle}
          iconBg="bg-amber-50 text-amber-600"
          title="Inactive Templates"
          value={inactiveCount}
          trend=""
          trendType="neutral"
          trendLabel="Archived templates"
        />
        <KpiCard
          icon={Layers}
          iconBg="bg-purple-50 text-purple-600"
          title="Categories"
          value={new Set(templatesList.map((t) => t.category)).size}
          trend=""
          trendType="neutral"
          trendLabel="Layout varieties"
        />
      </div>

      {/* 3. Main Split Section: Directory on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Templates Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">All Templates</h2>
            </div>

            {/* Toolbar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[220px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <p className="text-xs text-slate-400">Loading templates...</p>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-16 text-xs text-slate-400">No templates found</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Template Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Created On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                    {filteredTemplates.map((t) => {
                      const isSelected = selectedTemplate?._id === t._id;
                      const primaryColor = t.layoutConfig?.colorPalette?.primary || '#5046e5';

                      return (
                        <tr
                          key={t._id}
                          onClick={() => setSelectedTemplateId(t._id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-indigo-50/40 font-medium' : 'hover:bg-slate-50/60'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-9 rounded border border-slate-200 bg-slate-50 overflow-hidden flex flex-col shrink-0">
                                <div className="h-2.5 w-full" style={{ backgroundColor: primaryColor }}></div>
                                <div className="flex-1 p-0.5 flex flex-col gap-0.5">
                                  <div className="w-2.5 h-0.5 bg-slate-300 rounded-xs"></div>
                                  <div className="w-4 h-0.5 bg-slate-200 rounded-xs"></div>
                                </div>
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{t.name}</p>
                                <p className="text-[10px] text-slate-400">{t.description || '-'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 capitalize">
                              {t.category || 'Standard'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <StatusBadge status={t.isActive === false ? 'inactive' : 'active'} />
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-[11px] whitespace-nowrap">{formatDate(t.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
            <span>Showing {filteredTemplates.length} templates</span>
          </div>
        </div>

        {/* Right: Live Template Preview & Details (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Template Preview & Details</h2>

            {selectedTemplate ? (
              <>
                {/* Visual Card Preview */}
                <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm p-4">
                  <div
                    className="h-16 w-full rounded-xl flex items-end p-3 text-white relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${
                        selectedTemplate.layoutConfig?.colorPalette?.primary || '#5046e5'
                      }, #312e81)`
                    }}
                  >
                    <div className="absolute right-3 top-3 opacity-20">
                      <Sparkles className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 -mt-5 px-2">
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                      P
                    </div>
                    <div className="pt-6">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-bold text-slate-900">Employee Full Name</h3>
                        <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">✓</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Designation • Department</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 px-2 text-[11px]">
                    <p className="font-bold text-slate-700">Available Sections</p>
                    <div className="flex flex-wrap gap-1">
                      {(selectedTemplate.sectionOrder || ['experience', 'skills', 'projects', 'achievements', 'socialLinks']).map((sec) => (
                        <span key={sec} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium capitalize">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">Template Name</span>
                    <span className="font-semibold text-slate-800">{selectedTemplate.name}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">Category</span>
                    <span className="font-semibold text-slate-800 capitalize">{selectedTemplate.category}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">Slug</span>
                    <span className="font-mono text-slate-700 text-[11px]">{selectedTemplate.slug}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">Created On</span>
                    <span className="font-semibold text-slate-800">{formatDate(selectedTemplate.createdAt)}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-400">Status</span>
                    <StatusBadge status={selectedTemplate.isActive === false ? 'inactive' : 'active'} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-xs text-slate-400">Select a template to inspect details</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
