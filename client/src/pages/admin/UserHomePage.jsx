import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  Users,
  Building2,
  Calendar,
  Share2,
  ExternalLink,
  UserPlus,
  Check,
  ChevronRight,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  Eye,
  CreditCard,
  User,
  Heart,
  Bell,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { userDashboardApi } from '../../api/userDashboardApi';
import { connectionApi } from '../../api/connectionApi';
import { eventApi } from '../../api/eventApi';
import { useAuthStore } from '../../stores/authStore';

export const UserHomePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, member } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['user-home-dashboard'],
    queryFn: async () => {
      const res = await userDashboardApi.getHome();
      return res?.data || res;
    },
    staleTime: 30000
  });

  // Connect mutation
  const connectMutation = useMutation({
    mutationFn: async (recipientId) => {
      return await connectionApi.sendRequest(recipientId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-home-dashboard'] });
      showToast('Connection request sent!');
    }
  });

  // Register Event mutation
  const registerMutation = useMutation({
    mutationFn: async (eventId) => {
      return await eventApi.register(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-home-dashboard'] });
      showToast('Successfully registered for event!');
    }
  });

  const showToast = (msg) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  const hero = dashboard?.hero || {};
  const stats = dashboard?.stats || {};
  const myDepartment = dashboard?.myDepartment;
  const companySnapshot = dashboard?.companySnapshot;
  const upcomingEvents = dashboard?.upcomingEvents || [];
  const recentActivity = dashboard?.recentActivity || [];
  const recentlyActivePeople = dashboard?.recentlyActivePeople || [];

  const displayName = hero.name || member?.name || user?.email?.split('@')[0] || 'Alisha';
  const firstName = displayName.split(' ')[0];
  const profileSlug = hero.slug || 'profile';
  const publicProfileUrl = `${window.location.origin}/p/${profileSlug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicProfileUrl)}&color=6366f1&bgcolor=ffffff&qzone=1`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicProfileUrl);
    setCopied(true);
    showToast('Profile link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const formatEventDate = (dateStr) => {
    if (!dateStr) return { day: '12', month: 'OCT' };
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return { day, month };
  };

  const formatTimeRange = (start, end) => {
    if (!start) return '10:00 AM - 4:00 PM';
    const s = new Date(start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const e = end ? new Date(end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
    return e ? `${s} - ${e}` : s;
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

  const formatActivityTime = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {actionSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* 1. TOP ROW: Welcome Hero Banner (Left) & My Digital Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Welcome Banner */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#0d1224] to-[#1e1b4b] text-white p-7 md:p-9 flex flex-col justify-between shadow-xl border border-slate-800/80 group">
          {/* Architectural City Background Graphics */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_60%)] pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-35 bg-cover bg-center pointer-events-none mix-blend-screen"
               style={{ backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80')` }}
          />
          <div className="absolute right-6 top-6 hidden md:block text-right pointer-events-none opacity-80">
            <span className="text-[11px] uppercase tracking-widest font-mono text-indigo-300 font-semibold block">onewinq</span>
            <p className="font-serif italic text-sm text-indigo-100/90 leading-snug mt-1">
              One Identity<br />Infinite Possibilities
            </p>
          </div>

          {/* Banner Content */}
          <div className="relative z-10 space-y-3 max-w-lg">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>Good Morning, <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">{firstName}</span></span>
              <span className="inline-block hover:rotate-12 transition-transform cursor-default">👋</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
              Build your identity. Connect with your people. Make a bigger impact together.
            </p>
          </div>

          {/* Badges Pill Row */}
          <div className="relative z-10 flex flex-wrap items-center gap-2.5 pt-6 mt-4 border-t border-slate-800/60">
            {hero.designation && (
              <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-indigo-200 font-semibold backdrop-blur-md shadow-xs">
                {hero.designation}
              </span>
            )}
            {hero.department && (
              <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-200 font-medium backdrop-blur-md shadow-xs">
                {hero.department}
              </span>
            )}
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 font-medium backdrop-blur-md shadow-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              {formatLocation(hero.location)}
            </span>
          </div>
        </div>

        {/* Right: My Digital Card Preview */}
        <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900 font-display">My Digital Card</h3>
            <NavLink
              to={`/p/${profileSlug}`}
              target="_blank"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              View All
            </NavLink>
          </div>

          {/* Dark Digital Smart Card Widget */}
          <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#0c0f1d] via-[#141b2f] to-[#1e1e38] text-white shadow-lg border border-slate-800 flex flex-col justify-between overflow-hidden">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs tracking-tight text-indigo-400 font-mono">onewinq</span>
              {hero.nfcCard ? (
                <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full backdrop-blur-sm border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {hero.nfcCard.cardUid} • {hero.nfcCard.status === 'active' ? 'Active' : 'Pending'}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">NFC Digital</span>
              )}
            </div>

            {/* Middle Card info */}
            <div className="flex items-center gap-3 my-4">
              <div className="relative shrink-0">
                <img
                  src={hero.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`}
                  alt={displayName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-400/30 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{displayName}</h4>
                <p className="text-xs text-indigo-200 font-medium truncate">{hero.designation || 'Software Engineer'}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{hero.department || 'Engineering'}</p>
                <p className="text-[10px] text-slate-500 truncate">{hero.companyName || 'Nexisparkx Technologies'}</p>
              </div>

              {/* QR Code Widget */}
              <div className="p-1.5 bg-white rounded-xl shadow-xs shrink-0 flex flex-col items-center">
                <img src={qrUrl} alt="QR Code" className="w-14 h-14 rounded" />
                <span className="text-[8px] font-bold text-slate-800 tracking-tighter mt-0.5">Scan to Connect</span>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <NavLink
                to={`/p/${profileSlug}`}
                target="_blank"
                className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Card</span>
              </NavLink>
              <button
                onClick={handleCopyLink}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECOND ROW: Quick Actions (Left) & My Network (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Actions (4 Cards) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 mb-3 px-1">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Action 1: Edit Profile */}
            <NavLink
              to="/app/my-profile"
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 text-center flex flex-col items-center gap-2.5 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-950">Edit Profile</span>
            </NavLink>

            {/* Action 2: My Digital Card */}
            <NavLink
              to={`/p/${profileSlug}`}
              target="_blank"
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 text-center flex flex-col items-center gap-2.5 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-950">My Digital Card</span>
            </NavLink>

            {/* Action 3: Connect */}
            <NavLink
              to="/app/network"
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 text-center flex flex-col items-center gap-2.5 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-950">Connect</span>
            </NavLink>

            {/* Action 4: Events */}
            <NavLink
              to="/app/events"
              className="p-4 rounded-2xl bg-slate-50/80 hover:bg-indigo-50/60 border border-slate-100 hover:border-indigo-200 text-center flex flex-col items-center gap-2.5 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-950">Events</span>
            </NavLink>
          </div>
        </div>

        {/* My Network Snapshot (Right) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900">My Network</h3>
            <NavLink to="/app/network" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              View All
            </NavLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Connections */}
            <NavLink
              to="/app/network"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 transition-all flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-bold text-slate-900 block leading-tight">{stats.connectionsCount ?? 24}</span>
                <span className="text-[11px] text-slate-500 font-medium">Connections</span>
              </div>
            </NavLink>

            {/* Pending Requests */}
            <NavLink
              to="/app/network"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-100 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-base font-bold text-slate-900 block leading-tight">{stats.pendingRequestsCount ?? 3}</span>
                  <span className="text-[11px] text-slate-500 font-medium">Pending Requests</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </NavLink>

            {/* Explore People */}
            <NavLink
              to="/app/network"
              className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50/50 border border-slate-100 transition-all flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Explore People</span>
                <span className="text-[10px] text-slate-400 line-clamp-1">Find colleagues</span>
              </div>
            </NavLink>
          </div>
        </div>
      </div>

      {/* 3. THIRD ROW: Recently Active People (Colleagues Grid) */}
      <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm md:text-base font-bold text-slate-900">Recently Active People</h3>
            <p className="text-xs text-slate-400">Colleagues in your organization currently active</p>
          </div>
          <NavLink to="/app/network" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            View All
          </NavLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentlyActivePeople.slice(0, 4).map((person) => (
            <div
              key={person._id}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-indigo-100 transition-all flex flex-col items-center text-center space-y-2.5 hover:shadow-xs"
            >
              <div className="relative">
                <img
                  src={person.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=e0e7ff&color=4f46e5`}
                  alt={person.name}
                  className="w-14 h-14 rounded-2xl object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="min-w-0 w-full">
                <h4 className="text-xs font-bold text-slate-900 truncate">{person.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{person.designation || 'Specialist'}</p>
                <p className="text-[10px] text-indigo-600 font-medium truncate mt-0.5">{person.department || 'OneWinq'}</p>
              </div>

              {person.connectionStatus === 'connected' ? (
                <span className="w-full py-1.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Connected
                </span>
              ) : person.connectionStatus === 'pending' ? (
                <span className="w-full py-1.5 px-3 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center justify-center">
                  Pending
                </span>
              ) : (
                <button
                  onClick={() => connectMutation.mutate(person.userId)}
                  disabled={connectMutation.isPending}
                  className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 text-xs font-semibold transition-all shadow-2xs"
                >
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. FOURTH ROW: My Department (Left) & Company Profile Snapshot (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* My Department Widget */}
        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900">My Department</h3>
            <NavLink to="/app/team-departments" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              View All
            </NavLink>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{myDepartment?.name || 'Engineering'}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{myDepartment?.memberCount || 28} Members</p>
                {myDepartment?.head && (
                  <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Head: {myDepartment.head.name}</p>
                )}
              </div>
            </div>

            {/* Avatars Stack */}
            <div className="flex items-center -space-x-2">
              {myDepartment?.colleagues?.slice(0, 4).map((c, idx) => (
                <img
                  key={idx}
                  src={c.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=e0e7ff&color=4f46e5`}
                  alt={c.name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-2xs"
                  title={c.name}
                />
              ))}
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-2xs">
                +{Math.max(0, (myDepartment?.memberCount || 28) - 4)}
              </div>
            </div>
          </div>
        </div>

        {/* Company Profile Snapshot */}
        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-900">Company Profile</h3>
            <NavLink to="/company" target="_blank" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              View
            </NavLink>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0 font-bold text-lg font-display">
              {companySnapshot?.name ? companySnapshot.name.charAt(0) : 'N'}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {companySnapshot?.name || 'Nexisparkx Technologies'}
              </h4>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {formatLocation(companySnapshot?.location)}
              </p>
              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-normal">
                {companySnapshot?.description || companySnapshot?.tagline || 'Building innovative solutions for a connected and smarter tomorrow.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FIFTH ROW: Upcoming Events (Left) & Recent Activity + Promo Banner (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Upcoming Events */}
        <div className="lg:col-span-7 bg-white p-5 md:p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm md:text-base font-bold text-slate-900">Upcoming Events</h3>
              <p className="text-xs text-slate-400">Discover key summits and organization workshops</p>
            </div>
            <NavLink to="/app/events" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              View All
            </NavLink>
          </div>

          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">No upcoming events scheduled right now.</div>
            ) : (
              upcomingEvents.slice(0, 3).map((event) => {
                const { day, month } = formatEventDate(event.startDate);
                return (
                  <div
                    key={event._id}
                    className="p-3.5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Date Badge */}
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 text-center flex flex-col justify-center shrink-0 shadow-2xs">
                        <span className="text-xs font-bold text-slate-900 leading-none">{day}</span>
                        <span className="text-[9px] font-bold text-indigo-600 tracking-wider mt-0.5">{month}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{event.title}</h4>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formatTimeRange(event.startDate, event.endDate)}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{event.locationAddress || 'Main Auditorium'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {event.isRegistered ? (
                        <span className="py-1.5 px-3.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Registered
                        </span>
                      ) : (
                        <button
                          onClick={() => registerMutation.mutate(event._id)}
                          disabled={registerMutation.isPending}
                          className="py-1.5 px-4 rounded-xl bg-white hover:bg-indigo-50 text-indigo-600 border border-indigo-200 hover:border-indigo-300 text-xs font-semibold transition-all shadow-2xs"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Recent Activity & Together We Achieve More Banner */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Activity List */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              <span className="text-xs font-semibold text-slate-400">Live</span>
            </div>

            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/80">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-700">
                      <p><span className="font-semibold text-slate-900">Rohan Sharma</span> sent you a connection request.</p>
                      <span className="text-[10px] text-slate-400">2 minutes ago</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/80">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-700">
                      <p><span className="font-semibold text-slate-900">Megha Jain</span> viewed your digital card profile.</p>
                      <span className="text-[10px] text-slate-400">1 hour ago</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/80">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-700">
                      <p><span className="font-semibold text-slate-900">Priya Singh</span> accepted your connection request.</p>
                      <span className="text-[10px] text-slate-400">Yesterday</span>
                    </div>
                  </div>
                </div>
              ) : (
                recentActivity.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100/80">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-slate-700">
                      <p className="font-medium text-slate-900">{act.message || act.title}</p>
                      <span className="text-[10px] text-slate-400">{formatActivityTime(act.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Together We Achieve More Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-pink-50/40 border border-indigo-100/80 text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 font-display">Together We Achieve More</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Collaborate. Innovate. Grow. Only at OneWinq Enterprise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
