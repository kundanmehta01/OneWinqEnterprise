import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  X
} from 'lucide-react';
import { eventApi } from '../../api/eventApi';
import { departmentApi } from '../../api/departmentApi';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';
import { useAuthStore } from '../../stores/authStore';

export const UserEventsPage = () => {
  const queryClient = useQueryClient();
  const { isSuperAdmin, permissions } = useAuthStore();
  const canCreateEvent = isSuperAdmin || permissions?.includes('event.create') || permissions?.includes('*');

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'my', 'past'
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [timeframe, setTimeframe] = useState('upcoming');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

  // Attendees query for selected event details modal
  const { data: detailsAttendeesData, isLoading: isAttendeesLoading } = useQuery({
    queryKey: ['event-attendees', selectedEventForDetails?._id],
    queryFn: async () => {
      if (!selectedEventForDetails?._id) return [];
      const res = await eventApi.getAttendees(selectedEventForDetails._id);
      return res?.attendees || (Array.isArray(res) ? res : []);
    },
    enabled: Boolean(selectedEventForDetails?._id)
  });

  const modalAttendeesList = Array.isArray(detailsAttendeesData)
    ? detailsAttendeesData
    : detailsAttendeesData?.attendees || [];

  // Form State for User Creating Event
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'workshop',
    coverImageUrl: '',
    startDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString().slice(0, 16),
    locationType: 'physical',
    locationAddress: 'Auditorium, Indore HQ',
    meetingUrl: '',
    maxCapacity: 100,
    eligibility: { type: 'all', departmentIds: [] }
  });

  // 1. Fetch Events for user
  const { data: eventsResponse, isLoading } = useQuery({
    queryKey: ['user-events-list', activeTab, selectedType, selectedDepartment, timeframe, search],
    queryFn: async () => {
      if (activeTab === 'my') {
        const res = await eventApi.getMyEvents({ timeframe: timeframe === 'past' ? 'past' : 'upcoming' });
        return res?.data || res;
      }
      const params = {
        timeframe: activeTab === 'past' ? 'past' : timeframe
      };
      if (selectedType !== 'all') params.category = selectedType;
      if (search) params.search = search;
      const res = await eventApi.getEvents(params);
      return res?.data || res;
    }
  });

  // 2. Fetch My Registered Events for Sidebar
  const { data: myEventsResponse } = useQuery({
    queryKey: ['my-events-sidebar'],
    queryFn: async () => {
      const res = await eventApi.getMyEvents();
      return res?.data || res;
    }
  });

  // 3. Fetch Departments
  const { data: deptResponse } = useQuery({
    queryKey: ['user-dept-for-events'],
    queryFn: async () => {
      const res = await departmentApi.getAll();
      return Array.isArray(res) ? res : res?.data || [];
    }
  });

  const departments = Array.isArray(deptResponse)
    ? deptResponse
    : Array.isArray(deptResponse?.data)
    ? deptResponse.data
    : [];

  const rawEventsList = useMemo(() => {
    if (activeTab === 'my') {
      const myEvts = eventsResponse?.events || [];
      return myEvts.map((m) => ({
        ...(m.event || m),
        isRegistered: true,
        ticketCode: m.ticketCode
      }));
    }
    return Array.isArray(eventsResponse)
      ? eventsResponse
      : eventsResponse?.events || [];
  }, [eventsResponse, activeTab]);

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mutations
  const createEventMutation = useMutation({
    mutationFn: (data) => eventApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-events-list'] });
      queryClient.invalidateQueries({ queryKey: ['my-events-sidebar'] });
      setIsAddModalOpen(false);
      showToast('success', 'Event proposed & scheduled successfully!');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to create event.');
    }
  });

  const registerMutation = useMutation({
    mutationFn: (eventId) => eventApi.register(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['user-events-list'] });
      queryClient.invalidateQueries({ queryKey: ['my-events-sidebar'] });
      queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
      setSelectedEventForDetails((prev) => (prev?._id === eventId ? { ...prev, isRegistered: true, attendeeCount: (prev.attendeeCount || 0) + 1 } : prev));
      showToast('success', 'Successfully registered for event!');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || err?.message || 'Registration failed.');
    }
  });

  const cancelRegMutation = useMutation({
    mutationFn: (eventId) => eventApi.cancelRegistration(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['user-events-list'] });
      queryClient.invalidateQueries({ queryKey: ['my-events-sidebar'] });
      queryClient.invalidateQueries({ queryKey: ['event-attendees', eventId] });
      setSelectedEventForDetails((prev) => (prev?._id === eventId ? { ...prev, isRegistered: false, attendeeCount: Math.max(0, (prev.attendeeCount || 1) - 1) } : prev));
      showToast('success', 'Registration cancelled.');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || err?.message || 'Failed to cancel registration.');
    }
  });

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('all');
    setSelectedDepartment('all');
    setTimeframe('upcoming');
  };

  const formatEventDate = (dateStr) => {
    if (!dateStr) return { day: '12', month: 'OCT' };
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return { day, month };
  };

  const formatTime = (start, end) => {
    if (!start) return '10:00 AM - 12:00 PM';
    const s = new Date(start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const e = end ? new Date(end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';
    return e ? `${s} - ${e}` : s;
  };

  const getCategoryBadgeClass = (cat = '') => {
    switch (cat.toLowerCase()) {
      case 'workshop':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'tech talk':
      case 'company':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'leadership':
      case 'conference':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'wellness':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'team building':
      case 'social':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'webinar':
      case 'training':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  // Mini Calendar Generation
  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ day: null });
    }
    for (let d = 1; d <= totalDays; d++) {
      const hasEvent = rawEventsList.some((e) => {
        const evDate = new Date(e.startDate);
        return evDate.getFullYear() === year && evDate.getMonth() === month && evDate.getDate() === d;
      });
      days.push({ day: d, hasEvent });
    }
    return days;
  }, [currentCalendarDate, rawEventsList]);

  const monthName = currentCalendarDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const nextMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1));
  };
  const prevMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1));
  };

  const defaultMockImages = [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Top Header Banner (Matching Image 3) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-[#111827] to-[#1e1b4b] text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="space-y-1.5 z-10">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">Events</h1>
          <p className="text-xs md:text-sm text-slate-300">
            Discover, learn, connect, and grow with events at OneWinq.
          </p>
        </div>

        <div className="z-10 flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2.5 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span className="text-xs font-semibold text-indigo-100 italic">Learn · Connect · Grow</span>
          </div>
          {canCreateEvent && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Event</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200 text-xs font-semibold px-2">
        <button
          onClick={() => {
            setActiveTab('all');
            setTimeframe('upcoming');
          }}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Events
        </button>
        <button
          onClick={() => {
            setActiveTab('my');
            setTimeframe('upcoming');
          }}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'my'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Events
        </button>
        <button
          onClick={() => {
            setActiveTab('past');
            setTimeframe('past');
          }}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'past'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Past Events
        </button>
      </div>

      {/* 3. Main Body: Left 8 Columns (Events Grid & Filters) & Right 4 Columns (Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Filters + Cards Grid) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filters Bar (Matching Image 3) */}
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, topics, speakers..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Types Dropdown */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="workshop">Workshop</option>
              <option value="conference">Tech Talk / Conference</option>
              <option value="company">Company Townhall</option>
              <option value="training">Training</option>
              <option value="social">Team Building / Social</option>
              <option value="wellness">Wellness</option>
            </select>

            {/* Departments Dropdown */}
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* Timeframe Dropdown */}
            {activeTab === 'all' && (
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="upcoming">Upcoming</option>
                <option value="all">All Dates</option>
                <option value="past">Past</option>
              </select>
            )}

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              Reset
            </button>
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 bg-white rounded-3xl border border-slate-100">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-xs text-slate-400">Loading events...</p>
            </div>
          ) : rawEventsList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No events found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No events currently match your selected filters. Try adjusting your search or create an event.
              </p>
              {canCreateEvent && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  + Create Event
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {rawEventsList.map((event, idx) => {
                const { day, month } = formatEventDate(event.startDate);
                const isRegistered = event.isRegistered;
                const cover = event.coverImageUrl || defaultMockImages[idx % defaultMockImages.length];

                return (
                  <div
                    key={event._id}
                    className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Cover Image + Overlay Date Badge & Category */}
                      <div className="relative h-44 bg-slate-900 overflow-hidden">
                        <img
                          src={cover}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                        {/* Top Pills */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-xs bg-white/95 backdrop-blur-xs ${getCategoryBadgeClass(
                              event.category
                            )}`}
                          >
                            {event.category || 'Event'}
                          </span>
                          <button className="p-1 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md">
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Date Badge Overlay */}
                        <div className="absolute bottom-3 right-3 w-12 h-12 rounded-2xl bg-white text-slate-900 shadow-lg flex flex-col items-center justify-center font-display">
                          <span className="text-xs font-bold leading-none">{day}</span>
                          <span className="text-[9px] font-bold text-indigo-600 uppercase mt-0.5">{month}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {event.title}
                        </h3>

                        <div className="space-y-1 text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="text-[11px] font-medium">{formatTime(event.startDate, event.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {event.locationType === 'virtual' ? (
                              <Video className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            ) : (
                              <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            )}
                            <span className="text-[11px] font-medium truncate">
                              {event.locationType === 'virtual' ? 'Online (Microsoft Teams / Zoom)' : event.locationAddress || 'Auditorium, Indore HQ'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="text-[11px] text-slate-700 font-semibold">
                              {event.attendeeCount || 0} Registered {event.maxCapacity > 0 ? `· Max ${event.maxCapacity}` : ''}
                            </span>
                          </div>
                        </div>

                        {event.description && (
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer: Real Attendees Avatars + Action Button */}
                    <div className="p-5 pt-0 border-t border-slate-50 mt-3 flex items-center justify-between gap-2">
                      <div
                        onClick={() => setSelectedEventForDetails(event)}
                        className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        {event.attendees && event.attendees.length > 0 ? (
                          <div className="flex items-center -space-x-2">
                            {event.attendees.slice(0, 3).map((att, aIdx) => (
                              <img
                                key={aIdx}
                                src={att.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(att.name || 'Member')}&background=6366f1&color=fff`}
                                alt={att.name || 'Attendee'}
                                title={att.name}
                                className="w-6 h-6 rounded-full border-2 border-white object-cover shadow-2xs"
                              />
                            ))}
                            <span className="text-[10px] text-slate-500 font-medium pl-3">
                              {event.attendeeCount > 3 ? `+${event.attendeeCount - 3} joined` : 'Joined'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-indigo-600 font-semibold hover:underline">
                            View Details & Roster →
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedEventForDetails(event)}
                          className="py-1 px-2.5 rounded-lg text-slate-500 hover:text-slate-800 text-[11px] font-medium transition-colors"
                        >
                          Details
                        </button>
                        {isRegistered ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelRegMutation.mutate(event._id);
                            }}
                            disabled={cancelRegMutation.isPending}
                            className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-rose-50 text-emerald-700 hover:text-rose-600 border border-emerald-200 hover:border-rose-200 text-xs font-semibold transition-all"
                          >
                            Registered ✓
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              registerMutation.mutate(event._id);
                            }}
                            disabled={registerMutation.isPending}
                            className="py-1.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs"
                          >
                            Join Event
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Sidebar Column (Matching Image 3) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget 1: My Events */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-900 font-display">My Events</h3>
              <button
                onClick={() => setActiveTab('my')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                View All
              </button>
            </div>

            {/* My Events Sub-tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-semibold">
              <span className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">
                Registered ({myEventsResponse?.events?.length || (Array.isArray(myEventsResponse) ? myEventsResponse.length : 0)})
              </span>
            </div>

            {/* My Events List */}
            <div className="space-y-3">
              {(myEventsResponse?.events || (Array.isArray(myEventsResponse) ? myEventsResponse : [])).slice(0, 3).map((item) => {
                const ev = item.event || item;
                const { day, month } = formatEventDate(ev.startDate);
                return (
                  <div key={ev._id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-center flex flex-col justify-center shrink-0">
                        <span className="text-xs font-bold text-slate-900 leading-none">{day}</span>
                        <span className="text-[8px] font-bold text-indigo-600 uppercase">{month}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{ev.title}</h4>
                        <p className="text-[10px] text-slate-500">
                          {formatTime(ev.startDate, ev.endDate)} · {ev.locationType === 'virtual' ? 'Online' : ev.locationAddress || 'Campus'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => showToast('success', 'Event synced with calendar!')}
                      className="w-full py-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1 mt-1 border-t border-slate-200/60 pt-2"
                    >
                      <CalendarPlus className="w-3 h-3" />
                      <span>Add to Calendar</span>
                    </button>
                  </div>
                );
              })}
              {(!myEventsResponse?.events || myEventsResponse.events.length === 0) && (!Array.isArray(myEventsResponse) || myEventsResponse.length === 0) && (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No registered events yet.
                </div>
              )}
            </div>
          </div>

          {/* Widget 2: Interactive Mini Calendar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{monthName}</h3>
              <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-slate-100 text-slate-600">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-slate-100 text-slate-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <span key={d} className="text-[10px] font-semibold text-slate-400 py-1">
                  {d}
                </span>
              ))}
              {calendarDays.map((item, idx) => (
                <div key={idx} className="py-1 flex items-center justify-center">
                  {item.day ? (
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-medium flex items-center justify-center transition-all ${
                        item.hasEvent
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.day}
                    </span>
                  ) : (
                    <span className="w-7 h-7" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Widget 3: Organize an Event Promo Card */}
          {canCreateEvent && (
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                <CalendarPlus className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Organize an Event</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  Share knowledge, host a session, or bring your team together.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full py-2 px-4 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold text-xs shadow-2xs transition-all"
              >
                Create Event
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. MODAL: CREATE EVENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Schedule Enterprise Event</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createEventMutation.mutate(formData);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tech Innovation Summit 2025"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category / Format</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="conference">Tech Talk / Conference</option>
                    <option value="company">Company Townhall</option>
                    <option value="training">Training</option>
                    <option value="social">Team Building</option>
                    <option value="wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location Format</label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="physical">In-Person Campus</option>
                    <option value="virtual">Virtual (Teams/Zoom)</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image</label>
                <ImageUploadInput
                  value={formData.coverImageUrl}
                  onChange={(val) => setFormData({ ...formData, coverImageUrl: val })}
                  folder="events"
                  placeholder="https://... or upload event banner"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {formData.locationType === 'virtual' ? 'Virtual Meeting Link' : 'Location Address'}
                </label>
                <input
                  type="text"
                  placeholder={
                    formData.locationType === 'virtual'
                      ? 'https://meet.google.com/...'
                      : 'Auditorium, Indore HQ'
                  }
                  value={formData.locationType === 'virtual' ? formData.meetingUrl : formData.locationAddress}
                  onChange={(e) =>
                    formData.locationType === 'virtual'
                      ? setFormData({ ...formData, meetingUrl: e.target.value })
                      : setFormData({ ...formData, locationAddress: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key agenda, guest speakers, and discussion topics..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createEventMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
                >
                  {createEventMutation.isPending ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: EVENT DETAILS & REGISTERED PARTICIPANTS */}
      {selectedEventForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            {/* Modal Header & Cover */}
            <div className="relative h-48 bg-slate-900 overflow-hidden shrink-0">
              <img
                src={selectedEventForDetails.coverImageUrl || defaultMockImages[0]}
                alt={selectedEventForDetails.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/30 to-transparent" />
              <button
                onClick={() => setSelectedEventForDetails(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-xs bg-white/95 mb-1.5 ${getCategoryBadgeClass(
                      selectedEventForDetails.category
                    )}`}
                  >
                    {selectedEventForDetails.category || 'Event'}
                  </span>
                  <h2 className="text-lg md:text-xl font-bold text-white font-display leading-snug">
                    {selectedEventForDetails.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Event Metadata Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-indigo-500 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Schedule</p>
                    <p className="text-xs font-bold text-slate-800">
                      {formatTime(selectedEventForDetails.startDate, selectedEventForDetails.endDate)}
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  {selectedEventForDetails.locationType === 'virtual' ? (
                    <Video className="w-4 h-4 text-blue-500 shrink-0" />
                  ) : (
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Location</p>
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {selectedEventForDetails.locationType === 'virtual'
                        ? 'Online (Meeting Link)'
                        : selectedEventForDetails.locationAddress || 'Indore HQ'}
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <Users className="w-4 h-4 text-purple-500 shrink-0" />
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Capacity</p>
                    <p className="text-xs font-bold text-slate-800">
                      {selectedEventForDetails.attendeeCount || modalAttendeesList.length} Joined
                      {selectedEventForDetails.maxCapacity > 0 ? ` / ${selectedEventForDetails.maxCapacity}` : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Virtual Meeting Link if Registered & Virtual */}
              {selectedEventForDetails.locationType === 'virtual' && selectedEventForDetails.meetingUrl && (
                <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Video className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-semibold text-blue-900 truncate">
                      {selectedEventForDetails.meetingUrl}
                    </span>
                  </div>
                  <a
                    href={selectedEventForDetails.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-xl shrink-0 hover:bg-blue-700 transition-colors shadow-2xs"
                  >
                    Open Link
                  </a>
                </div>
              )}

              {/* Description */}
              {selectedEventForDetails.description && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">About this Event</h4>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {selectedEventForDetails.description}
                  </p>
                </div>
              )}

              {/* Registration Status Banner */}
              {selectedEventForDetails.isRegistered && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900">You are Registered for this Event</p>
                      <p className="text-[10px] text-emerald-700">Your pass is active. Show your pass upon arrival.</p>
                    </div>
                  </div>
                  {selectedEventForDetails.ticketCode && (
                    <span className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 font-mono text-xs font-bold text-emerald-800 shadow-2xs">
                      {selectedEventForDetails.ticketCode}
                    </span>
                  )}
                </div>
              )}

              {/* Dynamic Registered Participants Section */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Registered Participants ({modalAttendeesList.length})
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      Live Roster
                    </span>
                  </div>
                </div>

                {isAttendeesLoading ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                    <p className="text-xs text-slate-400">Loading registered colleagues...</p>
                  </div>
                ) : modalAttendeesList.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-400">
                    No participants have registered yet. Be the first to join!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {modalAttendeesList.map((att, aIdx) => (
                      <div
                        key={aIdx}
                        className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between gap-2.5 hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={att.user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(att.user?.name || 'Member')}&background=6366f1&color=fff`}
                            alt={att.user?.name || 'Attendee'}
                            className="w-8 h-8 rounded-full border border-slate-200 object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{att.user?.name || 'Colleague'}</p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {att.user?.designation || att.user?.department || 'Team Member'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 shrink-0">
                          {att.registeredAt ? new Date(att.registeredAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Confirmed'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 rounded-b-3xl">
              <button
                type="button"
                onClick={() => setSelectedEventForDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedEventForDetails.isRegistered ? (
                  <button
                    onClick={() => cancelRegMutation.mutate(selectedEventForDetails._id)}
                    disabled={cancelRegMutation.isPending}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs"
                  >
                    {cancelRegMutation.isPending ? 'Cancelling...' : 'Cancel Registration'}
                  </button>
                ) : (
                  <button
                    onClick={() => registerMutation.mutate(selectedEventForDetails._id)}
                    disabled={registerMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
                  >
                    {registerMutation.isPending ? 'Joining...' : 'Join Event Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEventsPage;
