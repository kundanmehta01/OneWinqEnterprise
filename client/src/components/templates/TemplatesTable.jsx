import React from 'react';
import { Search, SlidersHorizontal, ChevronDown, MoreHorizontal, ArrowUpDown, Copy, Edit, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Dropdown } from '../common/Dropdown';

export const TemplatesTable = ({
  templates = [],
  selectedTemplate,
  onSelectTemplate,
  search = '',
  onSearchChange,
  onDuplicate,
  onEdit,
  onArchive
}) => {
  const getCategoryBadgeVariant = (cat = '') => {
    switch (cat.toLowerCase()) {
      case 'executive':
        return 'purple';
      case 'management':
        return 'blue';
      case 'employee':
        return 'green';
      case 'founder':
        return 'amber';
      case 'company':
        return 'purple';
      default:
        return 'default';
    }
  };

  const sampleFallbackTemplates = [
    {
      _id: 't1',
      name: 'Executive Profile',
      description: 'Professional template for CXOs',
      category: 'Executive',
      type: 'Individual',
      assignedTo: '24 members',
      usage: 86,
      status: 'active',
      createdOn: '2025-05-10',
      updatedAt: '2025-05-18'
    },
    {
      _id: 't2',
      name: 'Manager Profile',
      description: 'Template for managers',
      category: 'Management',
      type: 'Individual',
      assignedTo: '38 members',
      usage: 72,
      status: 'active',
      createdOn: '2025-05-02',
      updatedAt: '2025-05-15'
    },
    {
      _id: 't3',
      name: 'Employee Profile',
      description: 'Standard template for employees',
      category: 'Employee',
      type: 'Individual',
      assignedTo: '142 members',
      usage: 142,
      status: 'active',
      createdOn: '2025-04-12',
      updatedAt: '2025-05-14'
    },
    {
      _id: 't4',
      name: 'Founder Profile',
      description: 'Template for founders',
      category: 'Founder',
      type: 'Individual',
      assignedTo: '15 members',
      usage: 23,
      status: 'active',
      createdOn: '2025-04-01',
      updatedAt: '2025-05-12'
    },
    {
      _id: 't5',
      name: 'Company Profile',
      description: 'Organization / company template',
      category: 'Company',
      type: 'Organization',
      assignedTo: '1 organization',
      usage: 18,
      status: 'active',
      createdOn: '2025-03-20',
      updatedAt: '2025-05-10'
    },
    {
      _id: 't6',
      name: 'Intern Profile',
      description: 'Template for interns',
      category: 'Employee',
      type: 'Individual',
      assignedTo: '8 members',
      usage: 12,
      status: 'inactive',
      createdOn: '2025-03-10',
      updatedAt: '2025-04-25'
    },
    {
      _id: 't7',
      name: 'Custom Minimal',
      description: 'Minimal clean template',
      category: 'Custom',
      type: 'Individual',
      assignedTo: '2 members',
      usage: 7,
      status: 'inactive',
      createdOn: '2025-02-18',
      updatedAt: '2025-04-15'
    }
  ];

  const tableData =
    templates.length > 0
      ? templates.map((t) => ({
          _id: t._id,
          name: t.name,
          description: t.description || 'Custom digital profile layout',
          category: t.category ? t.category.charAt(0).toUpperCase() + t.category.slice(1) : 'General',
          type: t.category === 'company' ? 'Organization' : 'Individual',
          assignedTo: '12 members',
          usage: 45,
          status: t.isActive ? 'active' : 'inactive',
          createdOn: t.createdAt,
          updatedAt: t.updatedAt
        }))
      : sampleFallbackTemplates;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
      {/* Table Header & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">All Templates</h3>
          <p className="text-xs text-slate-400 mt-0.5">View and manage all profile templates.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters</span>
          </button>

          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
            >
              <span>Sort by: Latest</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">
                <span className="inline-flex items-center gap-1 cursor-pointer hover:text-slate-600">
                  Template Name <ArrowUpDown className="w-3 h-3" />
                </span>
              </th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Assigned To</th>
              <th className="py-3 px-4">Usage</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {tableData.map((t) => {
              const isSelected = selectedTemplate?._id === t._id;

              const actionItems = [
                {
                  label: 'Edit Template',
                  icon: Edit,
                  onClick: () => onEdit?.(t)
                },
                {
                  label: 'Duplicate',
                  icon: Copy,
                  onClick: () => onDuplicate?.(t._id)
                },
                { divider: true },
                {
                  label: 'Archive',
                  icon: Trash2,
                  danger: true,
                  onClick: () => onArchive?.(t._id)
                }
              ];

              return (
                <tr
                  key={t._id}
                  onClick={() => onSelectTemplate(t)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50/70'
                  }`}
                >
                  {/* Name + Thumbnail + Description */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-0.5 overflow-hidden flex-shrink-0 shadow-2xs">
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-600/30 rounded flex flex-col justify-end p-0.5">
                          <div className="w-3 h-3 rounded-full bg-indigo-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-snug">{t.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">
                          {t.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="py-3.5 px-4">
                    <Badge variant={getCategoryBadgeVariant(t.category)}>
                      {t.category}
                    </Badge>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 text-slate-600">{t.type}</td>

                  {/* Assigned To Link */}
                  <td className="py-3.5 px-4 font-semibold text-indigo-600 hover:underline">
                    {t.assignedTo}
                  </td>

                  {/* Usage */}
                  <td className="py-3.5 px-4 font-bold text-slate-700">{t.usage}</td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <Badge variant={t.status === 'active' ? 'green' : 'amber'} dot>
                      {t.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      trigger={
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      }
                      items={actionItems}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
