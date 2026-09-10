import React, { useState, useEffect } from 'react';
import { userEventService } from '../services/userEventService';
import {
  Calendar, Clock, MapPin, Users, Plus, Search, Filter,
  ChevronLeft, ChevronRight, MoreHorizontal, Check, ExternalLink,
  Sparkles, CalendarPlus
} from 'lucide-react';

export const Events = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [registeredEvents, setRegisteredEvents] = useState(['e1']);
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const mockEvents = [
    {
      id: 'e1',
      title: 'Tech Innovation Summit 2025',
      category: 'Tech Talk',
      categoryColor: 'bg-indigo-50 text-indigo-700',
      day: '12',
      month: 'OCT',
      time: '10:00 AM - 12:00 PM',
      location: 'Auditorium, Indore HQ',
      interested: 150,
      description: 'Explore emerging technologies and their real-world applications with industry experts.',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
      speakers: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'],
      speakerCount: '+3 speakers'
    },
    {
      id: 'e2',
      title: 'Design Thinking Workshop',
      category: 'Workshop',
      categoryColor: 'bg-emerald-50 text-emerald-700',
      day: '18',
      month: 'OCT',
      time: '02:00 PM - 05:00 PM',
      location: 'Conference Room 1',
      interested: 40,
      description: 'A hands-on workshop to build creative problem-solving skills and user-centric prototypes.',
      coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
      speakers: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150'],
      speakerCount: '+2 speakers'
    },
    {
      id: 'e3',
      title: 'Leadership Talk',
      category: 'Leadership',
      categoryColor: 'bg-rose-50 text-rose-700',
      day: '25',
      month: 'OCT',
      time: '11:00 AM - 01:00 PM',
      location: 'Auditorium, Indore HQ',
      interested: 200,
      description: 'Insights from industry leaders on building high-performing teams, culture, and resilience.',
      coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600',
      speakers: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'],
      speakerCount: '+4 speakers'
    },
    {
      id: 'e4',
      title: 'Mental Wellness Session',
      category: 'Wellness',
      categoryColor: 'bg-sky-50 text-sky-700',
      day: '28',
      month: 'OCT',
      time: '04:00 PM - 05:00 PM',
      location: 'Online (Microsoft Teams)',
      interested: 120,
      description: 'Tips and techniques for a healthier and more productive mind, mindfulness, and balance.',
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
      speakers: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'],
      speakerCount: '+1 speaker'
    },
    {
      id: 'e5',
      title: 'Team Building Activities',
      category: 'Team Building',
      categoryColor: 'bg-amber-50 text-amber-700',
      day: '05',
      month: 'NOV',
      time: '10:00 AM - 01:00 PM',
      location: 'Outdoor Area, Indore HQ',
      interested: 80,
      description: 'Fun activities to build stronger teams, trust, camaraderie, and better cross-team collaboration.',
      coverImage: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=600',
      speakers: ['https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'],
      speakerCount: '+2 speakers'
    },
    {
      id: 'e6',
      title: 'AI for a Smarter Tomorrow',
      category: 'Webinar',
      categoryColor: 'bg-violet-50 text-violet-700',
      day: '10',
      month: 'NOV',
      time: '03:00 PM - 04:30 PM',
      location: 'Online (Zoom)',
      interested: 300,
      description: 'Understand how generative AI is transforming industries and what it means for enterprise tech.',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
      speakers: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'],
      speakerCount: '+3 speakers'
    },
  ];

  useEffect(() => {
    userEventService.getEvents()
      .then((res) => {
        // API may return { events: [...], pagination: {...} } or a plain array
        const eventsArray = Array.isArray(res)
          ? res
          : (Array.isArray(res?.events) ? res.events : []);

        if (eventsArray.length > 0) {
          // Normalize backend event shape to match our display fields
          const normalized = eventsArray.map((ev) => {
            const date = ev.date || ev.startDate || ev.startTime || null;
            const d = date ? new Date(date) : null;
            return {
              id: ev._id || ev.id,
              title: ev.title,
              category: ev.type || ev.category || 'Event',
              categoryColor: 'bg-indigo-50 text-indigo-700',
              day: d ? String(d.getDate()).padStart(2, '0') : '--',
              month: d ? d.toLocaleString('en', { month: 'short' }).toUpperCase() : '---',
              time: ev.time || ev.schedule || '',
              location: typeof ev.location === 'object'
                ? [ev.location.city, ev.location.country].filter(Boolean).join(', ')
                : (ev.location || ev.venue || ''),
              interested: ev.registeredCount || ev.interestedCount || 0,
              description: ev.description || '',
              coverImage: ev.coverImage || ev.image || '',
              speakers: ev.speakers || [],
              speakerCount: ev.speakers?.length ? `+${ev.speakers.length} speakers` : ''
            };
          });
          setEventsList(normalized);
        } else {
          setEventsList(mockEvents);
        }
      })
      .catch(() => setEventsList(mockEvents))
      .finally(() => setLoading(false));
  }, []);

  const toggleRegister = (id) => {
    setRegisteredEvents((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredEvents = eventsList.filter((ev) => {
    const matchSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === 'all' || ev.category?.toLowerCase() === selectedType.toLowerCase();

    if (activeTab === 'my-events') {
      return matchSearch && matchType && registeredEvents.includes(ev.id);
    }
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* ── Header Banner (Screenshot 3) ── */}
      <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Events</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Discover, learn, connect, and grow with events at OneWinq.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:block text-right">
            <span className="font-serif italic text-indigo-600 text-xs font-semibold block">
              Learn · Connect
            </span>
            <span className="font-serif italic text-indigo-500 text-xs font-semibold block">
              Grow Together
            </span>
          </div>
          <button
            type="button"
            onClick={() => alert('Create Event modal opens for department leads and administrators.')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex items-center gap-8 border-b border-slate-100 pb-3 text-xs font-bold">
        {[
          { key: 'all', label: 'All Events' },
          { key: 'my-events', label: 'My Events' },
          { key: 'past', label: 'Past Events' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 relative transition cursor-pointer ${
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

      {/* ── Filter Row ── */}
      <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, topics, speakers, or departments..."
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="Tech Talk">Tech Talk</option>
            <option value="Workshop">Workshop</option>
            <option value="Leadership">Leadership</option>
            <option value="Wellness">Wellness</option>
            <option value="Team Building">Team Building</option>
            <option value="Webinar">Webinar</option>
          </select>

          {/* Department Dropdown */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 outline-none cursor-pointer"
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Product">Product</option>
          </select>

          {/* Timing Dropdown */}
          <select
            className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 outline-none cursor-pointer"
          >
            <option>Upcoming</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>

          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedType('all'); setSelectedDept('all'); }}
            className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Main Layout: Events Grid + Right Column ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Events Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.map((ev) => {
            const isReg = registeredEvents.includes(ev.id);
            return (
              <div
                key={ev.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:border-indigo-100 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Event Cover Image + Date badge + Category */}
                  <div className="h-44 relative overflow-hidden">
                    <img
                      src={ev.coverImage}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />

                    {/* Category pill */}
                    <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-[10px] font-extrabold text-slate-800 shadow-xs">
                      {ev.category}
                    </span>

                    {/* Options 3 dots */}
                    <button
                      type="button"
                      className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {/* Date Badge */}
                    <div className="absolute bottom-3 right-3 w-12 h-12 rounded-xl bg-white flex flex-col items-center justify-center shadow-md">
                      <span className="text-sm font-extrabold text-slate-900 leading-none">{ev.day}</span>
                      <span className="text-[9px] font-extrabold text-slate-400 tracking-wider mt-0.5">{ev.month}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-sm font-black text-slate-900 line-clamp-1">{ev.title}</h3>

                    <div className="space-y-1 text-[11px] text-slate-400 font-medium">
                      <p className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" /> {ev.time}
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {ev.location}
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-500 font-semibold">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {ev.interested} Interested
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {ev.description}
                    </p>
                  </div>
                </div>

                {/* Footer: Speakers + View Details / Register */}
                <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-3 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {ev.speakers.map((s, i) => (
                        <img
                          key={i}
                          src={s}
                          alt="speaker"
                          className="w-6 h-6 rounded-full object-cover border-2 border-white shadow-2xs"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{ev.speakerCount}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleRegister(ev.id)}
                    className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      isReg
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'border border-indigo-200 hover:bg-indigo-50 text-indigo-600'
                    }`}
                  >
                    {isReg ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{isReg ? 'Registered' : 'View Details'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side Column (My Events + Mini Calendar + Organize) */}
        <div className="lg:col-span-4 space-y-6">
          {/* My Events Widget */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-900">My Events</h3>
              <button
                type="button"
                onClick={() => setActiveTab('my-events')}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
              >
                View All
              </button>
            </div>

            {/* Sub-tabs: Upcoming / Past */}
            <div className="flex items-center gap-4 text-xs font-bold border-b border-slate-50 pb-2">
              <span className="text-indigo-600 border-b-2 border-indigo-600 pb-2">Upcoming (2)</span>
              <span className="text-slate-400 pb-2">Past (3)</span>
            </div>

            {/* My registered items */}
            <div className="space-y-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-50/60 border border-slate-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center flex-shrink-0 shadow-2xs">
                  <span className="text-xs font-extrabold text-slate-900 leading-none">18</span>
                  <span className="text-[8px] font-extrabold text-slate-400">OCT</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">Design Thinking Workshop</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">02:00 PM - 05:00 PM</p>
                  <p className="text-[10px] text-slate-400">Conference Room 1</p>
                  <button className="mt-2 text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                    <CalendarPlus className="w-3 h-3" /> Add to Calendar
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/60 border border-slate-100 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center flex-shrink-0 shadow-2xs">
                  <span className="text-xs font-extrabold text-slate-900 leading-none">28</span>
                  <span className="text-[8px] font-extrabold text-slate-400">OCT</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">Mental Wellness Session</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">04:00 PM - 05:00 PM</p>
                  <p className="text-[10px] text-slate-400">Online (Teams)</p>
                  <button className="mt-2 text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                    <CalendarPlus className="w-3 h-3" /> Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Calendar Widget (Screenshot 3) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-extrabold text-slate-900">October 2025</h3>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg hover:bg-slate-50 text-slate-400">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded-lg hover:bg-slate-50 text-slate-400">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-slate-400 mb-2">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>

            {/* Calendar Numbers Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-700">
              <span className="text-slate-200">28</span><span className="text-slate-200">29</span><span className="text-slate-200">30</span>
              <span>1</span><span>2</span><span>3</span><span>4</span>
              <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
              {/* Event highlight 12 */}
              <span className="w-7 h-7 mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">12</span>
              <span>13</span><span>14</span><span>15</span><span>16</span><span>17</span>
              {/* Event highlight 18 */}
              <span className="w-7 h-7 mx-auto rounded-full bg-violet-100 text-violet-700 flex items-center justify-center">18</span>
              <span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span>
              {/* Event highlight 25 */}
              <span className="w-7 h-7 mx-auto rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">25</span>
              <span>26</span><span>27</span>
              {/* Event highlight 28 */}
              <span className="w-7 h-7 mx-auto rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">28</span>
              <span>29</span><span>30</span><span>31</span>
            </div>
          </div>

          {/* Organize an Event Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-extrabold text-slate-900">Organize an Event</h4>
            <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
              Share knowledge, host a session, or bring your team together.
            </p>
            <button
              type="button"
              className="mt-4 w-full py-2.5 rounded-xl border border-indigo-200 hover:bg-indigo-50 text-indigo-600 text-xs font-bold transition cursor-pointer"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
