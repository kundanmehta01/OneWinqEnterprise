import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FolderTree,
  Users,
  Search,
  Grid,
  List,
  MapPin,
  Sparkles,
  ExternalLink,
  MoreVertical,
  ChevronRight,
  Code2,
  Box,
  Palette,
  Megaphone,
  UserCheck,
  TrendingUp,
  Target,
  Settings2,
  Server,
  FileText,
  Building2,
  Shield,
  Layers,
  Check,
  Copy,
  UserPlus
} from 'lucide-react';
import { userDirectoryApi } from '../../api/userDirectoryApi';
import { connectionApi } from '../../api/connectionApi';

// Department Icon Map
const DEPT_ICON_MAP = {
  engineering: Code2,
  product: Box,
  design: Palette,
  marketing: Megaphone,
  'human resources': Users,
  hr: Users,
  finance: TrendingUp,
  sales: Target,
  operations: Settings2,
  'it & infrastructure': Server,
  it: Server,
  administration: FileText
};

const getDeptIcon = (name = '') => {
  const lower = name.toLowerCase().trim();
  for (const [key, icon] of Object.entries(DEPT_ICON_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return FolderTree;
};

export const TeamDepartmentsPage = () => {
  const queryClient = useQueryClient();
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [activeTab, setActiveTab] = useState('members'); // 'members', 'about', 'projects', 'announcements'
  const [deptSearch, setDeptSearch] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // 1. Fetch All Departments
  const { data: departments = [], isLoading: deptsLoading } = useQuery({
    queryKey: ['user-departments'],
    queryFn: async () => {
      const res = await userDirectoryApi.getDepartments();
      return res?.data || res || [];
    }
  });

  // Set default selected department on first load
  const activeDeptId = selectedDeptId || (departments.length > 0 ? departments[0]._id : null);

  // 2. Fetch Active Department Details & Members
  const { data: deptDetails, isLoading: deptDetailsLoading } = useQuery({
    queryKey: ['user-department-details', activeDeptId],
    queryFn: async () => {
      if (!activeDeptId) return null;
      const res = await userDirectoryApi.getDepartmentById(activeDeptId);
      return res?.data || res;
    },
    enabled: !!activeDeptId
  });

  // Connection request mutation
  const connectMutation = useMutation({
    mutationFn: async (recipientId) => {
      return await connectionApi.sendRequest(recipientId);
    },
    onSuccess: () => {
      showToast('Connection request sent!');
      queryClient.invalidateQueries({ queryKey: ['user-department-details'] });
    }
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleCopy = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
    setCopiedSlug(slug);
    showToast('Profile link copied!');
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const formatLocation = (loc) => {
    if (!loc) return 'Indore, MP';
    if (typeof loc === 'string') return loc;
    if (typeof loc === 'object') {
      const parts = [loc.city, loc.state, loc.country].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : loc.address || 'Indore, MP';
    }
    return String(loc);
  };

  // Filtered Departments
  const filteredDepts = useMemo(() => {
    if (!deptSearch) return departments;
    return departments.filter((d) => d.name.toLowerCase().includes(deptSearch.toLowerCase()));
  }, [departments, deptSearch]);

  // Current active department data
  const currentDept = deptDetails?.department || departments.find((d) => d._id === activeDeptId) || {};
  const allMembers = deptDetails?.members || [];

  // Filtered & Sorted Members
  const displayedMembers = useMemo(() => {
    let list = [...allMembers];
    if (memberSearch) {
      const q = memberSearch.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.designation.toLowerCase().includes(q) ||
          (m.skills &&
            m.skills.some((s) => {
              const str = typeof s === 'string' ? s : s?.name || '';
              return str.toLowerCase().includes(q);
            }))
      );
    }

    if (sortBy === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }
    return list;
  }, [allMembers, memberSearch, sortBy]);

  const DeptIcon = getDeptIcon(currentDept.name);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5">
          {toastMsg}
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#111827] to-[#1e1b4b] text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="space-y-1.5 z-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
            Team & Departments
          </h1>
          <p className="text-xs md:text-sm text-slate-300">
            Explore departments and connect with your colleagues across the organization.
          </p>
        </div>

        {/* Banner Graphic badge */}
        <div className="z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-200 block font-semibold">Stronger Teams</span>
            <span className="text-xs font-bold text-white">Brighter Tomorrow</span>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Departments List */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900 font-display">Departments</h3>
            <span className="text-xs font-semibold text-slate-400">{departments.length} total</span>
          </div>

          {/* Search Departments */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={deptSearch}
              onChange={(e) => setDeptSearch(e.target.value)}
              placeholder="Search departments..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Department List Items */}
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {deptsLoading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading departments...</div>
            ) : filteredDepts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No departments found.</div>
            ) : (
              filteredDepts.map((dept) => {
                const isSelected = dept._id === activeDeptId;
                const Icon = getDeptIcon(dept.name);
                return (
                  <button
                    key={dept._id}
                    onClick={() => {
                      setSelectedDeptId(dept._id);
                      setMemberSearch('');
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50/80 border border-indigo-200 text-indigo-950 font-semibold shadow-2xs'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate leading-tight">{dept.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{dept.memberCount || 0} Members</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-indigo-600 translate-x-0.5' : 'text-slate-300'}`} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Department Details & Members */}
        <div className="lg:col-span-8 space-y-5">
          {/* Department Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                  <DeptIcon className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">{currentDept.name || 'Engineering'}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentDept.description || 'Building innovative solutions for a connected future.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="text-center px-3">
                  <span className="text-lg font-bold text-slate-900 block leading-none">{allMembers.length}</span>
                  <span className="text-[10px] font-medium text-slate-400">Members</span>
                </div>
                <div className="h-8 w-px bg-slate-200 hidden md:block" />
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Indore, MP</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100/80">
              {currentDept.description
                ? currentDept.description
                : `Develop, maintain and scale our products with cutting-edge technologies and a collaborative mindset across ${currentDept.name || 'this department'}.`}
            </p>
          </div>

          {/* Department Tabs & Toolbar */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-5 space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-100 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('members')}
                className={`pb-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'members'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Team Members ({allMembers.length})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`pb-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'about'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                About Department
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`pb-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'projects'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`pb-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'announcements'
                    ? 'border-indigo-600 text-indigo-600 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Announcements
              </button>
            </div>

            {/* Content: Team Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-4">
                {/* Sub-toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder="Search team members..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
                    >
                      <option value="name_asc">Sort by: Name (A–Z)</option>
                      <option value="name_desc">Sort by: Name (Z–A)</option>
                    </select>

                    <div className="flex items-center p-1 rounded-xl bg-slate-100 text-slate-600">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-2xs text-indigo-600' : 'hover:text-slate-900'}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-2xs text-indigo-600' : 'hover:text-slate-900'}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Members View */}
                {deptDetailsLoading ? (
                  <div className="py-16 text-center text-xs text-slate-400">Loading department colleagues...</div>
                ) : displayedMembers.length === 0 ? (
                  <div className="py-16 text-center text-xs text-slate-400">No team members match the search query.</div>
                ) : viewMode === 'grid' ? (
                  /* Grid View (Matching Image 2) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {displayedMembers.map((member) => (
                      <div
                        key={member._id}
                        className="p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-indigo-200 transition-all flex flex-col items-center text-center group shadow-2xs hover:shadow-sm"
                      >
                        {/* Avatar + Online Indicator */}
                        <div className="relative mb-2.5">
                          <img
                            src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=e0e7ff&color=4f46e5`}
                            alt={member.name}
                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all"
                          />
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                        </div>

                        {/* Name & Title */}
                        <div className="min-w-0 w-full mb-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{member.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium truncate">{member.designation || 'Engineer'}</p>
                          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{formatLocation(member.location)}</span>
                          </p>
                        </div>

                        {/* Skills Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-1 my-2 min-h-[26px]">
                          {member.skills && member.skills.length > 0 ? (
                            member.skills.slice(0, 3).map((skill, sIdx) => {
                              const skillText = typeof skill === 'string' ? skill : skill?.name || 'Skill';
                              return (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-medium text-slate-600 truncate max-w-[80px]"
                                >
                                  {skillText}
                                </span>
                              );
                            })
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] text-slate-400">
                              OneWinq
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full flex items-center gap-1.5 mt-auto pt-2 border-t border-slate-100">
                          <NavLink
                            to={`/p/${member.slug || 'profile'}`}
                            target="_blank"
                            className="flex-1 py-1.5 px-2 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-600 text-[11px] font-semibold transition-all shadow-2xs text-center truncate"
                          >
                            View Profile
                          </NavLink>
                          <button
                            onClick={() => handleCopy(member.slug)}
                            title="Copy link"
                            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 transition-colors"
                          >
                            {copiedSlug === member.slug ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-2">
                    {displayedMembers.map((member) => (
                      <div
                        key={member._id}
                        className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-indigo-200 transition-all flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={member.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=e0e7ff&color=4f46e5`}
                              alt={member.name}
                              className="w-11 h-11 rounded-xl object-cover"
                            />
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{member.name}</h4>
                            <p className="text-[11px] text-slate-500 font-medium truncate">{member.designation}</p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{formatLocation(member.location)}</span>
                            </p>
                          </div>
                        </div>

                        {/* Skills & Action */}
                        <div className="flex items-center gap-3">
                          <div className="hidden md:flex items-center gap-1.5">
                            {member.skills?.slice(0, 3).map((skill, sIdx) => {
                              const skillText = typeof skill === 'string' ? skill : skill?.name || 'Skill';
                              return (
                                <span
                                  key={sIdx}
                                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-600"
                                >
                                  {skillText}
                                </span>
                              );
                            })}
                          </div>
                          <NavLink
                            to={`/p/${member.slug || 'profile'}`}
                            target="_blank"
                            className="py-1.5 px-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-600 text-xs font-semibold transition-all shadow-2xs"
                          >
                            View Profile
                          </NavLink>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content: About Department Tab */}
            {activeTab === 'about' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 text-xs text-slate-600 leading-relaxed">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Department Mission</h4>
                  <p>
                    {currentDept.description ||
                      `${currentDept.name} is dedicated to building robust scalable digital infrastructure and delivering top tier customer value.`}
                  </p>
                </div>
                {currentDept.head && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      {currentDept.head.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{currentDept.head.name}</p>
                      <p className="text-[11px] text-slate-500">Department Head · {currentDept.head.designation}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Content: Projects Tab */}
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">ACTIVE</span>
                  <h4 className="text-xs font-bold text-slate-900">OneWinq Enterprise v2 Core Engine</h4>
                  <p className="text-[11px] text-slate-500">
                    High-throughput microservices architecture with real-time sync and enterprise NFC intelligence.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold">IN PROGRESS</span>
                  <h4 className="text-xs font-bold text-slate-900">Mobile Smart Tap & Digital Business Identity</h4>
                  <p className="text-[11px] text-slate-500">
                    Cross-platform mobile experience for instant business contact exchanging.
                  </p>
                </div>
              </div>
            )}

            {/* Content: Announcements Tab */}
            {activeTab === 'announcements' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Q3 All-Hands Sprint Planning</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Join the department retrospective this Thursday at 3:00 PM IST in Conference Room 1.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDepartmentsPage;
