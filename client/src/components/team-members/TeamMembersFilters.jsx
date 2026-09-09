import React from 'react';
import { Search, SlidersHorizontal, LayoutGrid, ChevronDown } from 'lucide-react';

export const TeamMembersFilters = ({
  search = '',
  departmentId = '',
  roleId = '',
  status = '',
  departments = [],
  roles = [],
  onFilterChange
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-3 mb-4">
      {/* Search and Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto flex-1">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1 sm:flex-initial">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search members..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition shadow-2xs"
          />
        </div>

        {/* Department Dropdown */}
        <div className="relative">
          <select
            value={departmentId}
            onChange={(e) => onFilterChange({ departmentId: e.target.value })}
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-300 transition cursor-pointer shadow-2xs"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Role Dropdown */}
        <div className="relative">
          <select
            value={roleId}
            onChange={(e) => onFilterChange({ roleId: e.target.value })}
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-300 transition cursor-pointer shadow-2xs"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-slate-300 transition cursor-pointer shadow-2xs"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending Approval</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Right Toolbar Action Buttons */}
      <div className="flex items-center gap-2 self-end lg:self-auto">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>Filters</span>
        </button>

        <button
          type="button"
          className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition shadow-2xs cursor-pointer"
          title="Toggle Grid View"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
