import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  UserCheck,
  Check,
  X,
  Building2,
  MapPin,
  Mail,
  Filter,
  MessageSquare,
  Clock
} from 'lucide-react';
import { networkService } from '../services/networkService';

export default function Network() {
  const [activeTab, setActiveTab] = useState('All People');
  const [people, setPeople] = useState([]);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);

  // Optimistic UI state for sent/handled requests
  const [sentRequests, setSentRequests] = useState(new Set());
  const [handledRequests, setHandledRequests] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [peopleRes, connRes, reqRes] = await Promise.all([
        networkService.getPeople(),
        networkService.getConnections(),
        networkService.getRequests()
      ]);

      if (peopleRes?.data?.people) {
        setPeople(peopleRes.data.people);
      }
      if (connRes?.data?.connections) {
        setConnections(connRes.data.connections);
      }
      if (reqRes?.data?.requests) {
        setRequests(reqRes.data.requests);
      }
    } catch (err) {
      console.error('Failed to load network data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (personId) => {
    setSentRequests(prev => new Set(prev).add(personId));
    try {
      await networkService.sendRequest(personId);
    } catch (err) {
      console.error('Failed to send connection request', err);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setHandledRequests(prev => ({ ...prev, [requestId]: 'accepted' }));
    try {
      await networkService.respondToRequest(requestId, 'accept');
    } catch (err) {
      console.error('Failed to accept request', err);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    setHandledRequests(prev => ({ ...prev, [requestId]: 'declined' }));
    try {
      await networkService.respondToRequest(requestId, 'decline');
    } catch (err) {
      console.error('Failed to decline request', err);
    }
  };

  // Fallback colleagues if backend returned empty list
  const displayPeople = people.length > 0 ? people : [
    {
      id: 'p1',
      name: 'Rohan Sharma',
      role: 'Product Manager',
      department: 'Product',
      location: 'Indore, MP',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face',
      skills: ['Product Strategy', 'Roadmapping', 'Agile']
    },
    {
      id: 'p2',
      name: 'Megha Jain',
      role: 'Senior Developer',
      department: 'Engineering',
      location: 'Bangalore',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face',
      skills: ['Node.js', 'PostgreSQL', 'Microservices']
    },
    {
      id: 'p3',
      name: 'Aman Verma',
      role: 'UI/UX Designer',
      department: 'Design',
      location: 'Delhi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face',
      skills: ['Figma', 'User Research', 'Design Systems']
    },
    {
      id: 'p4',
      name: 'Priya Singh',
      role: 'QA Engineer',
      department: 'Engineering',
      location: 'Mumbai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
      skills: ['Automation', 'Cypress', 'API Testing']
    },
    {
      id: 'p5',
      name: 'Karan Malhotra',
      role: 'Lead Architect',
      department: 'Engineering',
      location: 'Indore, MP',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      skills: ['AWS', 'Kubernetes', 'High Scale']
    },
    {
      id: 'p6',
      name: 'Neha Gupta',
      role: 'Frontend Engineer',
      department: 'Engineering',
      location: 'Pune',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face',
      skills: ['React', 'Next.js', 'Tailwind CSS']
    }
  ];

  const filteredPeople = displayPeople.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || p.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', 'Engineering', 'Product', 'Design', 'Marketing', 'Human Resources'];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Colleague Network</h1>
          <p className="text-sm text-gray-500 mt-0.5">Discover colleagues, build connections, and collaborate across teams.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold">
            {displayPeople.length} Colleagues Available
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-0.5 scrollbar-none">
        {[
          { name: 'All People', count: displayPeople.length },
          { name: 'My Connections', count: connections.length },
          { name: 'Pending Requests', count: requests.length }
        ].map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-[2px] ${
              activeTab === tab.name
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>{tab.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === tab.name ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, role, or department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Department Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDept === dept
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: All People Grid */}
      {activeTab === 'All People' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPeople.map(person => {
            const hasRequested = sentRequests.has(person.id);

            return (
              <div
                key={person.id}
                className="bg-white rounded-3xl border border-gray-100 p-5 shadow-xs hover:border-indigo-100 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <img
                      src={person.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face'}
                      alt={person.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gray-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{person.name}</h3>
                      <p className="text-xs text-indigo-600 font-medium truncate">{person.role}</p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                        <span className="flex items-center gap-1 truncate">
                          <Building2 className="w-3 h-3 text-indigo-400" />
                          {person.department}
                        </span>
                        {person.location && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {person.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skills Pills */}
                  {person.skills && person.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 mt-3 border-t border-gray-50">
                      {person.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-md text-[10px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Connect Action Button */}
                <div className="pt-2">
                  {hasRequested ? (
                    <button
                      disabled
                      className="w-full py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-default"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Request Sent</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(person.id)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: My Connections */}
      {activeTab === 'My Connections' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs text-center space-y-4">
          <Users className="w-12 h-12 text-indigo-400 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-gray-900">Connections Active</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              Your direct enterprise network allows you to message teammates directly and collaborate on shared projects.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('All People')}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors inline-block"
          >
            Explore Colleagues Directory
          </button>
        </div>
      )}

      {/* Tab: Pending Requests */}
      {activeTab === 'Pending Requests' && (
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map(req => {
              const status = handledRequests[req.id];
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {req.senderName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{req.senderName}</h4>
                      <p className="text-[11px] text-gray-500">{req.senderRole} • {req.senderDepartment}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {status === 'accepted' ? (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                        Accepted
                      </span>
                    ) : status === 'declined' ? (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg">
                        Declined
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="px-3.5 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold"
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs text-center space-y-2">
              <Check className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-gray-900">No pending requests</h3>
              <p className="text-xs text-gray-500">You are all caught up on your incoming connection requests.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
