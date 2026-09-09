import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userDashboardService } from '../services/userDashboardService';
import { publicProfileService } from '../../services/publicProfileService';
import {
  User, QrCode, UserPlus, MessageSquare, Users,
  Share2, ArrowRight, ExternalLink, Calendar, MapPin,
  Clock, Building2, CheckCircle2, ChevronRight, Search,
  TrendingUp, Sparkles, Building
} from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const UserDashboard = () => {
  const { user, member } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectStates, setConnectStates] = useState({});

  useEffect(() => {
    userDashboardService.getDashboard()
      .then((res) => setData(res))
      .catch((err) => console.warn('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const hero = data?.hero || {
    name: member?.name || user?.name || 'Alisha Batham',
    designation: member?.designation || 'Software Engineer',
    department: member?.departmentId?.name || 'Engineering Department',
    companyName: member?.companyId?.name || 'Nexisparkx Technologies',
    location: 'Indore, MP',
    slug: member?.profileId?.slug || 'alisha-batham'
  };

  const firstName = hero.name.split(' ')[0] || 'Alisha';
  const qrUrl = hero.slug ? publicProfileService.getQrCodeUrl(hero.slug) : null;

  // Active People List (matching screenshot 1)
  const activePeople = [
    { id: '1', name: 'Rohan Sharma', title: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
    { id: '2', name: 'Megha Jain', title: 'UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250' },
    { id: '3', name: 'Karan Malhotra', title: 'DevOps Engineer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
    { id: '4', name: 'Priya Singh', title: 'Data Analyst', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250' },
  ];

  // Upcoming Events (matching screenshot 1)
  const events = [
    {
      id: 'e1',
      day: '12',
      month: 'OCT',
      title: 'Tech Innovation Summit 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Nexisparkx Office'
    },
    {
      id: 'e2',
      day: '18',
      month: 'OCT',
      title: 'Design Thinking Workshop',
      time: '02:00 PM - 5:00 PM',
      location: 'Conference Room 1'
    },
    {
      id: 'e3',
      day: '25',
      month: 'OCT',
      title: 'Leadership Talk',
      time: '11:00 AM - 1:00 PM',
      location: 'Auditorium'
    }
  ];

  // Recent Activity Feed
  const recentActivities = [
    { id: 'a1', user: 'Rohan Sharma', action: 'sent you a connection request.', time: '2 minutes ago', type: 'request' },
    { id: 'a2', user: 'Megha Jain', action: 'liked your post.', time: '1 hour ago', type: 'like' },
    { id: 'a3', user: 'You', action: 'updated your profile.', time: '3 hours ago', type: 'update' },
    { id: 'a4', user: 'OneWinq Team', action: 'shared a company update.', time: '5 hours ago', type: 'system' },
    { id: 'a5', user: 'Priya Singh', action: 'accepted your connection request.', time: '1 day ago', type: 'connected' }
  ];

  const handleConnect = (id) => {
    setConnectStates((prev) => ({
      ...prev,
      [id]: prev[id] === 'pending' ? null : 'pending'
    }));
  };

  return (
    <div className="space-y-6">
      {/* ── ROW 1: Hero Banner + My Digital Card Widget ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Hero Banner */}
        <div className="lg:col-span-8 bg-gradient-to-r from-[#0C1226] via-[#141C38] to-[#1C2750] rounded-3xl p-7 text-white relative overflow-hidden flex flex-col justify-between shadow-xl min-h-[220px]">
          {/* Subtle glowing lights & graphics */}
          <div className="absolute top-0 right-0 w-96 h-full opacity-40 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

          {/* Right Floating Visual (Glass building + tagline overlay) */}
          <div className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col items-end pointer-events-none pr-2">
            <div className="font-serif italic text-indigo-200/90 text-xl font-light text-right leading-tight max-w-[170px] drop-shadow-sm mb-3">
              One Identity Infinite Possibilities
            </div>
            <div className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-extrabold text-white tracking-widest uppercase">
              onewinq
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Good Morning, <br className="sm:hidden" />
              <span>{firstName}</span>
              <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/80 mt-2 font-medium leading-relaxed max-w-md">
              Build your identity. Connect with your people. Make a bigger impact together.
            </p>

            {/* Pill Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white">
                {hero.designation}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white">
                {hero.department}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-white flex items-center gap-1">
                <MapPin className="w-3 h-3 text-indigo-300" />
                {hero.location}
              </span>
            </div>
          </div>
        </div>

        {/* Right "My Digital Card" Preview Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">My Digital Card</h3>
            <Link to="/user/card" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
              View All
            </Link>
          </div>

          {/* Dark Identity Card Preview */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-4 text-white relative overflow-hidden shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-white tracking-tight">onewinq</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-400 bg-indigo-900 flex items-center justify-center font-extrabold text-white text-base overflow-hidden flex-shrink-0">
                {hero.avatarUrl ? (
                  <img src={hero.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  hero.name.charAt(0)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-extrabold text-white truncate">{hero.name}</h4>
                <p className="text-[10px] text-slate-300 truncate">{hero.designation}</p>
                <p className="text-[9px] text-slate-400 truncate">{hero.department}</p>
                <p className="text-[9px] text-indigo-300 font-medium truncate">{hero.companyName}</p>
              </div>
              {/* QR Code thumbnail */}
              <div className="w-11 h-11 rounded-lg bg-white p-0.5 flex flex-col items-center justify-center flex-shrink-0">
                {qrUrl ? (
                  <img src={qrUrl} alt="QR" className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="w-8 h-8 text-slate-900" />
                )}
              </div>
            </div>
            <div className="text-right mt-1 text-[8px] text-slate-400 tracking-wider uppercase font-mono">
              Scan to Connect
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Link
              to="/user/card"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Card</span>
            </Link>
            <button
              type="button"
              onClick={async () => {
                const url = `${window.location.origin}/p/${hero.slug}`;
                if (navigator.share) {
                  try { await navigator.share({ title: hero.name, url }); } catch (_) {}
                } else {
                  await navigator.clipboard.writeText(url);
                  alert('Profile link copied to clipboard!');
                }
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Quick Actions + My Network ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Actions (4 cards) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-extrabold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Edit Profile', path: '/user/profile', icon: User, color: 'bg-indigo-50 text-indigo-600' },
              { label: 'My Digital Card', path: '/user/card', icon: QrCode, color: 'bg-violet-50 text-violet-600' },
              { label: 'Connect', path: '/user/network', icon: UserPlus, color: 'bg-sky-50 text-sky-600' },
              { label: 'Messages', path: '/user/messages', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition flex flex-col items-center text-center group"
                >
                  <div className={`w-11 h-11 rounded-2xl ${action.color} flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105 shadow-2xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* My Network (Metrics + Explore People) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-slate-900">My Network</h3>
            <Link to="/user/network" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 24 Connections */}
            <Link to="/user/network?tab=connections" className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-indigo-50/40 transition">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-xl font-extrabold text-slate-900">{data?.stats?.connectionsCount || 24}</div>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Connections</p>
            </Link>

            {/* 3 Pending Requests */}
            <Link to="/user/network?tab=requests" className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-amber-50/40 transition">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="text-xl font-extrabold text-slate-900 flex items-center justify-between">
                <span>{data?.stats?.pendingRequestsCount || 3}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Pending Requests</p>
            </Link>

            {/* Explore People */}
            <Link to="/user/network" className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 hover:bg-indigo-100/50 transition">
              <div className="w-8 h-8 rounded-xl bg-white text-indigo-600 flex items-center justify-center mb-2 shadow-2xs">
                <Search className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900 leading-tight">Explore People</div>
              <p className="text-[9px] text-slate-500 font-medium mt-1 leading-snug">Find and connect with colleagues</p>
            </Link>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Recently Active People ── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-extrabold text-slate-900">Recently Active People</h3>
          <Link to="/user/network" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activePeople.map((person) => {
            const isPending = connectStates[person.id] === 'pending';
            return (
              <div
                key={person.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition flex flex-col items-center text-center"
              >
                {/* Avatar with online indicator */}
                <div className="relative mb-3">
                  <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 truncate w-full">{person.name}</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate w-full">{person.title}</p>
                <button
                  type="button"
                  onClick={() => handleConnect(person.id)}
                  className={`mt-4 w-full py-1.5 px-3 rounded-xl text-xs font-bold transition ${
                    isPending
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'border border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {isPending ? 'Pending' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ROW 4: My Department & Company Profile ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* My Department Widget */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold text-slate-900">My Department</h3>
              <Link to="/user/teams" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
                View All
              </Link>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {data?.myDepartment?.name || 'Engineering'}
                </h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {data?.myDepartment?.memberCount || 28} Members
                </p>
              </div>
            </div>
          </div>

          {/* Members Avatars Row */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
            {activePeople.map((p) => (
              <img
                key={p.id}
                src={p.avatar}
                alt={p.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-2xs"
              />
            ))}
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white text-slate-500 font-extrabold text-[10px] flex items-center justify-center shadow-2xs">
              +24
            </div>
          </div>
        </div>

        {/* Company Profile Widget */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold text-slate-900">Company Profile</h3>
              <Link to="/user/company" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
                View
              </Link>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {data?.companySnapshot?.name || 'Nexisparkx Technologies'}
                </h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Indore, Madhya Pradesh
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {data?.companySnapshot?.description || 'Building innovative solutions for a connected and smarter tomorrow.'}
          </p>
        </div>
      </div>

      {/* ── ROW 5: Upcoming Events + Recent Activity + Together Illustration ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upcoming Events */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-slate-900">Upcoming Events</h3>
            <Link to="/user/events" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-indigo-100 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Date badge */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/70 flex flex-col items-center justify-center shadow-2xs flex-shrink-0">
                    <span className="text-sm font-extrabold text-slate-900 leading-none">{ev.day}</span>
                    <span className="text-[9px] font-extrabold text-slate-400 tracking-wider mt-0.5">{ev.month}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-800 truncate">{ev.title}</h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <Clock className="w-3 h-3" /> {ev.time}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3" /> {ev.location}
                    </p>
                  </div>
                </div>
                <Link
                  to="/user/events"
                  className="px-3 py-1.5 rounded-xl border border-indigo-200 hover:bg-indigo-50 text-indigo-600 text-xs font-bold transition flex-shrink-0"
                >
                  Register
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-slate-900">Recent Activity</h3>
            <Link to="/user/notifications" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">
              View All
            </Link>
          </div>

          <div className="space-y-3.5">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs leading-snug">
                  <span className="font-extrabold text-slate-800">{act.user} </span>
                  <span className="text-slate-600">{act.action}</span>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Right "Together We Achieve More" illustration card */}
        <div className="lg:col-span-3 bg-gradient-to-br from-indigo-50/80 to-violet-50/80 rounded-3xl p-6 border border-indigo-100/60 shadow-sm flex flex-col justify-between text-center items-center">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600 mb-3">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 leading-snug">Together We Achieve More</h4>
            <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
              Collaborate. Innovate. Grow. Only at OneWinq.
            </p>
          </div>
          <Link
            to="/user/teams"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-600 border border-indigo-200 text-xs font-extrabold shadow-xs hover:bg-indigo-50 transition"
          >
            <span>Explore Teams</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
