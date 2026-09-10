import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { userDirectoryService } from '../services/userDirectoryService';
import {
  Search, Users, Building2, MapPin, Grid, List,
  MoreVertical, ExternalLink, ChevronRight, Sparkles,
  Layers, Palette, Megaphone, UserCheck, DollarSign,
  TrendingUp, Settings2, Server, FileText, CheckCircle2
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const DEPT_ICONS = {
  Engineering: Layers,
  Product: Building2,
  Design: Palette,
  Marketing: Megaphone,
  'Human Resources': UserCheck,
  Finance: DollarSign,
  Sales: TrendingUp,
  Operations: Settings2,
  'IT & Infrastructure': Server,
  Administration: FileText,
};

export const Teams = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [activeTab, setActiveTab] = useState('members');
  const [searchDept, setSearchDept] = useState('');
  const [searchMember, setSearchMember] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  // Mock comprehensive data matching Screenshot 2
  const initialDepartments = [
    { id: 'dept-1', name: 'Engineering', count: 28, description: 'Building innovative solutions for a connected future.', location: 'Indore, MP' },
    { id: 'dept-2', name: 'Product', count: 18, description: 'Defining roadmap, user stories, and product market fit.', location: 'Indore, MP' },
    { id: 'dept-3', name: 'Design', count: 12, description: 'Crafting intuitive UI/UX design systems and customer journeys.', location: 'Indore, MP' },
    { id: 'dept-4', name: 'Marketing', count: 10, description: 'Driving growth, storytelling, brand awareness, and demand.', location: 'Indore, MP' },
    { id: 'dept-5', name: 'Human Resources', count: 8, description: 'Cultivating culture, talent acquisition, and people success.', location: 'Indore, MP' },
    { id: 'dept-6', name: 'Finance', count: 6, description: 'Strategic accounting, budgeting, auditing, and investments.', location: 'Indore, MP' },
    { id: 'dept-7', name: 'Sales', count: 9, description: 'Forging client partnerships, deals, and revenue expansion.', location: 'Indore, MP' },
    { id: 'dept-8', name: 'Operations', count: 7, description: 'Optimizing corporate processes, delivery, and scaling.', location: 'Indore, MP' },
    { id: 'dept-9', name: 'IT & Infrastructure', count: 6, description: 'Zero-trust security, cloud infra, and enterprise networking.', location: 'Indore, MP' },
    { id: 'dept-10', name: 'Administration', count: 4, description: 'Workplace facilities, legal compliance, and office ops.', location: 'Indore, MP' },
  ];

  const allMembers = [
    { id: 'm1', name: 'Alisha Batham', designation: 'Software Engineer', location: 'Indore, MP', deptId: 'dept-1', skills: ['Java', 'Spring Boot', 'React'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250', slug: 'alisha-batham' },
    { id: 'm2', name: 'Rohan Sharma', designation: 'Tech Lead', location: 'Indore, MP', deptId: 'dept-1', skills: ['Java', 'Microservices', 'AWS'], avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', slug: 'rohan-sharma' },
    { id: 'm3', name: 'Megha Jain', designation: 'Senior Developer', location: 'Indore, MP', deptId: 'dept-1', skills: ['React', 'UI/UX', 'TypeScript'], avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250', slug: 'megha-jain' },
    { id: 'm4', name: 'Karan Malhotra', designation: 'DevOps Engineer', location: 'Indore, MP', deptId: 'dept-1', skills: ['AWS', 'Docker', 'Kubernetes'], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', slug: 'karan-malhotra' },
    { id: 'm5', name: 'Priya Singh', designation: 'Software Engineer', location: 'Indore, MP', deptId: 'dept-1', skills: ['Python', 'Data Analysis', 'SQL'], avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250', slug: 'priya-singh' },
    { id: 'm6', name: 'Aman Verma', designation: 'Backend Developer', location: 'Indore, MP', deptId: 'dept-1', skills: ['Java', 'Spring Boot', 'MySQL'], avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', slug: 'aman-verma' },
    { id: 'm7', name: 'Neha Gupta', designation: 'QA Engineer', location: 'Indore, MP', deptId: 'dept-1', skills: ['Selenium', 'Manual Testing', 'JIRA'], avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', slug: 'neha-gupta' },
    { id: 'm8', name: 'Rahul Dubey', designation: 'Full Stack Developer', location: 'Indore, MP', deptId: 'dept-1', skills: ['React', 'Node.js', 'MongoDB'], avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250', slug: 'rahul-dubey' },
    { id: 'm9', name: 'Sneha Patil', designation: 'Software Engineer', location: 'Indore, MP', deptId: 'dept-1', skills: ['C++', 'DSA', 'Problem Solving'], avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250', slug: 'sneha-patil' },
    { id: 'm10', name: 'Vikram Soni', designation: 'System Administrator', location: 'Indore, MP', deptId: 'dept-1', skills: ['Linux', 'Networking', 'Security'], avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250', slug: 'vikram-soni' },
    { id: 'm11', name: 'Isha Verma', designation: 'Cloud Engineer', location: 'Indore, MP', deptId: 'dept-1', skills: ['AWS', 'Terraform', 'CI/CD'], avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250', slug: 'isha-verma' },
    { id: 'm12', name: 'Aditya Rao', designation: 'Mobile App Developer', location: 'Indore, MP', deptId: 'dept-1', skills: ['Flutter', 'Dart', 'Firebase'], avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250', slug: 'aditya-rao' },
  ];

  useEffect(() => {
    userDirectoryService.getDepartments()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          const mapped = res.map((d) => ({
            id: d._id,
            name: d.name,
            count: d.memberCount || 10,
            description: d.description || 'Shaping company excellence.',
            location: 'Indore, MP'
          }));
          setDepartments(mapped);
          setSelectedDeptId(mapped[0].id);
        } else {
          setDepartments(initialDepartments);
          setSelectedDeptId(initialDepartments[0].id);
        }
      })
      .catch(() => {
        setDepartments(initialDepartments);
        setSelectedDeptId(initialDepartments[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedDept = departments.find((d) => d.id === selectedDeptId) || departments[0] || initialDepartments[0];

  // Filter departments by search
  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(searchDept.toLowerCase())
  );

  // Filter team members
  const filteredMembers = useMemo(() => {
    let list = allMembers.filter((m) =>
      m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.skills.some((s) => s.toLowerCase().includes(searchMember.toLowerCase()))
    );

    if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }
    return list;
  }, [searchMember, sortBy]);

  return (
    <div className="space-y-6">
      {/* ── Header Banner (matching Screenshot 2) ── */}
      <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Team &amp; Departments</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Explore departments and connect with your colleagues across the organization.
          </p>
        </div>

        {/* Right Slogan Graphic */}
        <div className="hidden lg:flex items-center gap-4 bg-indigo-50/60 border border-indigo-100/60 px-5 py-3 rounded-2xl">
          <div className="flex -space-x-2 overflow-hidden">
            {allMembers.slice(0, 4).map((m) => (
              <img key={m.id} src={m.avatar} alt="member" className="w-7 h-7 rounded-full object-cover border-2 border-white" />
            ))}
          </div>
          <div className="text-right">
            <span className="font-serif italic text-indigo-700 text-sm font-semibold leading-tight block">
              Stronger Teams
            </span>
            <span className="font-serif italic text-indigo-500 text-xs leading-tight block">
              Brighter Tomorrow
            </span>
          </div>
        </div>
      </div>

      {/* ── Two Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Departments List (300px on desktop) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Departments</h3>

          {/* Search Departments Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              placeholder="Search departments..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition"
            />
          </div>

          {/* Department items list */}
          <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
            {filteredDepartments.map((dept) => {
              const isSelected = dept.id === selectedDeptId;
              const IconComponent = DEPT_ICONS[dept.name] || Building2;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/90 text-indigo-700 border border-indigo-100 shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate">{dept.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{dept.count} Members</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Department Details & Members Grid */}
        <div className="lg:col-span-8 space-y-6">
          {/* Department Overview Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black flex-shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">{selectedDept?.name}</h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{selectedDept?.description}</p>
                </div>
              </div>

              {/* Stats pill */}
              <div className="flex items-center gap-4 sm:border-l sm:border-slate-100 sm:pl-6 text-right">
                <div>
                  <span className="text-base font-extrabold text-slate-900 block leading-tight">{selectedDept?.count}</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Members</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{selectedDept?.location}</span>
                </div>
              </div>
            </div>

            {/* Department Navigation Tabs */}
            <div className="flex items-center gap-6 pt-4 text-xs font-bold border-b border-slate-50">
              {[
                { key: 'members', label: 'Team Members' },
                { key: 'about', label: 'About Department' },
                { key: 'projects', label: 'Projects' },
                { key: 'announcements', label: 'Announcements' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 relative transition cursor-pointer ${
                    activeTab === tab.key ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Filter and View Mode Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  placeholder="Search team members..."
                  className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 outline-none cursor-pointer"
                >
                  <option value="name-asc">Sort by Name (A-Z)</option>
                  <option value="name-desc">Sort by Name (Z-A)</option>
                </select>

                {/* Grid / List View Toggle */}
                <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === 'list' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Members Grid (4 cards per row matching Screenshot 2) */}
          {activeTab === 'members' ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4' : 'space-y-3'}>
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Avatar with online green dot */}
                    <div className="relative w-14 h-14 mx-auto mb-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover border-2 border-white shadow-xs"
                      />
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    <h4 className="text-xs font-black text-slate-900 text-center truncate">{member.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium text-center truncate mt-0.5">{member.designation}</p>

                    <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      <span>{member.location}</span>
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-1 mt-3">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={() => navigate(`/p/${member.slug}`)}
                      className="flex-1 py-1.5 rounded-xl border border-indigo-200 hover:bg-indigo-50 text-indigo-600 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>View Profile</span>
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-slate-400 text-xs">
              Content for {activeTab} will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teams;
