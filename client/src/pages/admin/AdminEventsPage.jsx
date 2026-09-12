import React, { useState } from 'react';
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
  X,
  Sparkles,
  Loader2,
  Edit3,
  Ban,
  UserCheck
} from 'lucide-react';
import { eventApi } from '../../api/eventApi';
import { departmentApi } from '../../api/departmentApi';
import { KpiCard } from '../../components/common/KpiCard';
import { ImageUploadInput } from '../../components/common/ImageUploadInput';

export const AdminEventsPage = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeframe, setTimeframe] = useState('all'); // 'all', 'upcoming', 'past'
  const [statusFilter, setStatusFilter] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State for Admin Creating / Editing Event
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'company',
    coverImageUrl: '',
    startDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString().slice(0, 16),
    locationType: 'physical',
    locationAddress: 'Auditorium, Indore HQ',
    meetingUrl: '',
    maxCapacity: 100,
    eligibility: { type: 'all', departmentIds: [] }
  });

  // 1. Fetch All Events for Admin Management
  const { data: eventsResponse, isLoading } = useQuery({
    queryKey: ['admin-events-list', timeframe, selectedCategory, search],
    queryFn: async () => {
      const params = {};
      if (timeframe !== 'all') params.timeframe = timeframe;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (search) params.search = search;
      const res = await eventApi.getEvents(params);
      return res?.data || res;
    }
  });

  // 2. Fetch Attendees for selected event
  const { data: attendeesResponse, isLoading: isAttendeesLoading } = useQuery({
    queryKey: ['admin-event-attendees', selectedEventForAttendees?._id],
    queryFn: async () => {
      if (!selectedEventForAttendees?._id) return [];
      const res = await eventApi.getAttendees(selectedEventForAttendees._id);
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.attendees)) return res.attendees;
      if (Array.isArray(res?.data?.attendees)) return res.data.attendees;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    },
    enabled: Boolean(selectedEventForAttendees?._id)
  });

  // 3. Fetch Departments
  const { data: deptResponse } = useQuery({
    queryKey: ['admin-dept-for-events'],
    queryFn: async () => {
      const res = await departmentApi.getAll();
      return Array.isArray(res) ? res : res?.data || [];
    }
  });

  const eventsList = Array.isArray(eventsResponse)
    ? eventsResponse
    : eventsResponse?.events || [];

  const attendeesList = Array.isArray(attendeesResponse)
    ? attendeesResponse
    : Array.isArray(attendeesResponse?.attendees)
    ? attendeesResponse.attendees
    : [];

  const departments = Array.isArray(deptResponse)
    ? deptResponse
    : Array.isArray(deptResponse?.data)
    ? deptResponse.data
    : [];

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mutations
  const createEventMutation = useMutation({
    mutationFn: (data) => eventApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events-list'] });
      setIsAddModalOpen(false);
      setFormData({
        title: '',
        description: '',
        category: 'company',
        coverImageUrl: '',
        startDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
        endDate: new Date(Date.now() + 86400000 * 2 + 7200000).toISOString().slice(0, 16),
        locationType: 'physical',
        locationAddress: 'Auditorium, Indore HQ',
        meetingUrl: '',
        maxCapacity: 100,
        eligibility: { type: 'all', departmentIds: [] }
      });
      showToast('success', 'Enterprise Event published successfully!');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to create event.');
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }) => eventApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events-list'] });
      setEditingEvent(null);
      showToast('success', 'Event updated successfully!');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to update event.');
    }
  });

  const cancelEventMutation = useMutation({
    mutationFn: (eventId) => eventApi.cancel(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events-list'] });
      showToast('success', 'Event has been cancelled.');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to cancel event.');
    }
  });

  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title || '',
      description: evt.description || '',
      category: evt.category || 'company',
      coverImageUrl: evt.coverImageUrl || '',
      startDate: evt.startDate ? new Date(evt.startDate).toISOString().slice(0, 16) : '',
      endDate: evt.endDate ? new Date(evt.endDate).toISOString().slice(0, 16) : '',
      locationType: evt.locationType || 'physical',
      locationAddress: evt.locationAddress || 'Auditorium, Indore HQ',
      meetingUrl: evt.meetingUrl || '',
      maxCapacity: evt.maxCapacity || 0,
      eligibility: evt.eligibility || { type: 'all', departmentIds: [] }
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? '-'
      : d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
  };

  const getCategoryBadgeClass = (cat = '') => {
    switch (cat.toLowerCase()) {
      case 'company':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'workshop':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'conference':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'training':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'social':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const upcomingCount = eventsList.filter((e) => new Date(e.startDate) >= new Date()).length;
  const totalRegistrations = eventsList.reduce((acc, curr) => acc + (curr.attendeeCount || curr.registeredCount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
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

      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
            Enterprise Event Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create organization summits, seminars, and workshops. Monitor RSVP capacities and export attendee rosters.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* 2. 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={Calendar}
          iconBg="bg-indigo-50 text-indigo-600"
          title="Total Events"
          value={eventsList.length}
          trend=""
          trendType="neutral"
          trendLabel="Scheduled events"
        />
        <KpiCard
          icon={Clock}
          iconBg="bg-blue-50 text-blue-600"
          title="Upcoming"
          value={upcomingCount}
          trend=""
          trendType="neutral"
          trendLabel="Active sessions"
        />
        <KpiCard
          icon={UserCheck}
          iconBg="bg-emerald-50 text-emerald-600"
          title="Total RSVPs"
          value={totalRegistrations}
          trend=""
          trendType="neutral"
          trendLabel="Employee registrations"
        />
        <KpiCard
          icon={Sparkles}
          iconBg="bg-purple-50 text-purple-600"
          title="Live & Hybrid"
          value={eventsList.filter((e) => e.locationType !== 'physical').length}
          trend=""
          trendType="neutral"
          trendLabel="Virtual/Hybrid sessions"
        />
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or location..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Timeframe Filter */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="all">All Dates</option>
            <option value="upcoming">Upcoming Only</option>
            <option value="past">Past Only</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="company">Company Townhall</option>
            <option value="workshop">Workshop</option>
            <option value="conference">Conference</option>
            <option value="training">Training</option>
            <option value="social">Team Social</option>
          </select>
        </div>
      </div>

      {/* 4. Events Grid for Organization Admin */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2 bg-white rounded-3xl border border-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs text-slate-400">Loading enterprise events...</p>
        </div>
      ) : eventsList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No events scheduled</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create an event to bring employees together across departments.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl shadow-xs"
          >
            + Create New Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsList.map((event) => {
            const regCount = event.attendeeCount || event.registeredCount || 0;
            const cap = event.maxCapacity || 0;
            const progress = cap > 0 ? Math.min(100, Math.round((regCount / cap) * 100)) : 0;
            const isPast = new Date(event.endDate) < new Date();

            return (
              <div
                key={event._id}
                className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  {/* Event Cover Banner */}
                  <div className="h-40 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
                    {event.coverImageUrl ? (
                      <img
                        src={event.coverImageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        <Calendar className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-xs bg-white/95 backdrop-blur-xs ${getCategoryBadgeClass(
                          event.category
                        )}`}
                      >
                        {event.category || 'Event'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          event.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-700'
                            : isPast
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {event.status === 'cancelled' ? 'CANCELLED' : isPast ? 'COMPLETED' : 'PUBLISHED'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{event.description}</p>
                    )}

                    <div className="space-y-1.5 pt-2 border-t border-slate-50 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="text-[11px] font-medium">{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.locationType === 'virtual' ? (
                          <Video className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                        <span className="text-[11px] font-medium truncate">
                          {event.locationType === 'virtual'
                            ? 'Virtual Meeting'
                            : event.locationAddress || 'Main Campus Auditorium'}
                        </span>
                      </div>
                    </div>

                    {/* Capacity Progress Indicator */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span>RSVP Capacity</span>
                        <span className="font-semibold text-slate-700">
                          {regCount} {cap > 0 ? `/ ${cap} (${progress}%)` : 'registered'}
                        </span>
                      </div>
                      {cap > 0 && (
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              progress >= 100 ? 'bg-rose-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Admin Actions */}
                <div className="p-5 pt-0 border-t border-slate-50 mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedEventForAttendees(event)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>View Attendees ({regCount})</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {event.status !== 'cancelled' && (
                      <button
                        onClick={() => openEditModal(event)}
                        title="Edit Event"
                        className="p-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 text-slate-400 hover:text-indigo-600 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {event.status !== 'cancelled' && !isPast && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to cancel "${event.title}"?`)) {
                            cancelEventMutation.mutate(event._id);
                          }
                        }}
                        disabled={cancelEventMutation.isPending}
                        title="Cancel Event"
                        className="p-1.5 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. MODAL: CREATE EVENT (Admin) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-display">Schedule Organization Event</h3>
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
                  placeholder="e.g. Q3 All-Hands & Product Innovation Summit"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="company">Company Townhall</option>
                    <option value="workshop">Workshop</option>
                    <option value="conference">Conference</option>
                    <option value="training">Training</option>
                    <option value="social">Team Social</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Format</label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="physical">In-Person Campus</option>
                    <option value="virtual">Virtual Online</option>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Capacity (0 = unlimited)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {formData.locationType === 'virtual' ? 'Virtual Meeting URL' : 'Location Address'}
                  </label>
                  <input
                    type="text"
                    placeholder={formData.locationType === 'virtual' ? 'https://meet.google.com/...' : 'Auditorium, Indore HQ'}
                    value={formData.locationType === 'virtual' ? formData.meetingUrl : formData.locationAddress}
                    onChange={(e) =>
                      formData.locationType === 'virtual'
                        ? setFormData({ ...formData, meetingUrl: e.target.value })
                        : setFormData({ ...formData, locationAddress: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Agenda</label>
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

      {/* 5B. MODAL: EDIT EVENT (Admin) */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 font-display">Edit Organization Event</h3>
              <button onClick={() => setEditingEvent(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateEventMutation.mutate({ id: editingEvent._id, data: formData });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 All-Hands & Product Innovation Summit"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="company">Company Townhall</option>
                    <option value="workshop">Workshop</option>
                    <option value="conference">Conference</option>
                    <option value="training">Training</option>
                    <option value="social">Team Social</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Format</label>
                  <select
                    value={formData.locationType}
                    onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="physical">In-Person Campus</option>
                    <option value="virtual">Virtual Online</option>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Capacity (0 = unlimited)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {formData.locationType === 'virtual' ? 'Virtual Meeting URL' : 'Location Address'}
                  </label>
                  <input
                    type="text"
                    placeholder={formData.locationType === 'virtual' ? 'https://meet.google.com/...' : 'Auditorium, Indore HQ'}
                    value={formData.locationType === 'virtual' ? formData.meetingUrl : formData.locationAddress}
                    onChange={(e) =>
                      formData.locationType === 'virtual'
                        ? setFormData({ ...formData, meetingUrl: e.target.value })
                        : setFormData({ ...formData, locationAddress: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Agenda</label>
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
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateEventMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm"
                >
                  {updateEventMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: ATTENDEES ROSTER (Admin Only) */}
      {selectedEventForAttendees && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-lg p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 font-display">Registered Attendees</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                    {attendeesList.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-sm">{selectedEventForAttendees.title}</p>
              </div>
              <button
                onClick={() => setSelectedEventForAttendees(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isAttendeesLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <p className="text-xs text-slate-400">Loading attendees roster...</p>
              </div>
            ) : attendeesList.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="font-medium text-slate-600">No registered attendees yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">When colleagues register for this event, they will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[55vh] overflow-y-auto pr-1">
                {attendeesList.map((att, idx) => {
                  const name = att.user?.name || att.name || 'Team Member';
                  const email = att.user?.email || att.email || '';
                  const designation = att.user?.designation || 'Team Member';
                  const department = att.user?.department || '';
                  const avatar = att.user?.avatarUrl;

                  return (
                    <div key={idx} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition-colors">
                      <div className="flex items-center gap-3">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-100">
                            {(name || email || 'A').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900">{name}</p>
                            {department && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-md font-medium">
                                {department}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400">{email} &bull; {designation}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/80 block">
                          {att.ticketCode || 'OWQ-EVT'}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-1 block">
                          {att.registeredAt ? new Date(att.registeredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Confirmed'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;
