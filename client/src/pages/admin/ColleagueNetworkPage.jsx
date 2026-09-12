import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  UserPlus,
  UserCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  X,
  Check,
  Send,
  Loader2,
  Trash2,
  Building2
} from 'lucide-react';
import { connectionApi } from '../../api/connectionApi';
import { departmentApi } from '../../api/departmentApi';
import { KpiCard } from '../../components/common/KpiCard';
import { useAuthStore } from '../../stores/authStore';

export const ColleagueNetworkPage = () => {
  const { isSuperAdmin } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('explore'); // 'explore', 'connections', 'requests'
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  // Send request modal
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [connectionNote, setConnectionNote] = useState('');

  // 1. Fetch People Directory
  const { data: peopleResponse, isLoading: isPeopleLoading } = useQuery({
    queryKey: ['network-people', search, selectedDept],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (selectedDept !== 'all') params.departmentId = selectedDept;
      const res = await connectionApi.getPeople(params);
      return res?.data || res;
    },
    enabled: activeTab === 'explore' && !isSuperAdmin
  });

  // 2. Fetch My Connections
  const { data: connectionsResponse, isLoading: isConnLoading } = useQuery({
    queryKey: ['my-connections'],
    queryFn: async () => {
      const res = await connectionApi.getMyConnections();
      return res?.data || res;
    },
    enabled: activeTab === 'connections' && !isSuperAdmin
  });

  if (isSuperAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center animate-fadeIn">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Users className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Enterprise Colleague Network</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            You are logged in as the Supreme Enterprise Administrator. Peer networking and card exchanges are designed for individual team members. To view and manage all enterprise employees and their contact cards, use the Team Members Hub.
          </p>
          <div className="pt-3">
            <a
              href="/admin/team"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-200 transition-all hover:scale-[1.02]"
            >
              <Users className="w-4 h-4" /> Go to Team Members Hub
            </a>
          </div>
        </div>
      </div>
    );
  }

  // 3. Fetch Incoming & Outgoing Requests
  const { data: incomingResponse, isLoading: isIncomingLoading } = useQuery({
    queryKey: ['incoming-requests'],
    queryFn: async () => {
      const res = await connectionApi.getIncomingRequests();
      return res?.data || res;
    },
    enabled: activeTab === 'requests'
  });

  const { data: outgoingResponse } = useQuery({
    queryKey: ['outgoing-requests'],
    queryFn: async () => {
      const res = await connectionApi.getOutgoingRequests();
      return res?.data || res;
    },
    enabled: activeTab === 'requests'
  });

  // 4. Fetch Departments for filter
  const { data: deptResponse } = useQuery({
    queryKey: ['dept-for-network'],
    queryFn: async () => {
      const res = await departmentApi.getAll();
      return Array.isArray(res) ? res : res?.data || [];
    }
  });

  const peopleList = Array.isArray(peopleResponse)
    ? peopleResponse
    : peopleResponse?.people || [];

  const connectionsList = Array.isArray(connectionsResponse)
    ? connectionsResponse
    : connectionsResponse?.connections || [];

  const incomingList = Array.isArray(incomingResponse)
    ? incomingResponse
    : incomingResponse?.requests || [];

  const outgoingList = Array.isArray(outgoingResponse)
    ? outgoingResponse
    : outgoingResponse?.requests || [];

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
  const sendRequestMutation = useMutation({
    mutationFn: ({ recipientId, note }) => connectionApi.sendRequest(recipientId, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-people'] });
      queryClient.invalidateQueries({ queryKey: ['outgoing-requests'] });
      queryClient.invalidateQueries({ queryKey: ['user-home-dashboard'] });
      setSelectedRecipient(null);
      setConnectionNote('');
      showToast('success', 'Connection request sent!');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to send request.');
    }
  });

  const acceptRequestMutation = useMutation({
    mutationFn: (connectionId) => connectionApi.acceptRequest(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incoming-requests'] });
      queryClient.invalidateQueries({ queryKey: ['my-connections'] });
      queryClient.invalidateQueries({ queryKey: ['network-people'] });
      queryClient.invalidateQueries({ queryKey: ['user-home-dashboard'] });
      showToast('success', 'Connection accepted! You are now connected.');
    }
  });

  const declineRequestMutation = useMutation({
    mutationFn: (connectionId) => connectionApi.declineRequest(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incoming-requests'] });
      queryClient.invalidateQueries({ queryKey: ['network-people'] });
      queryClient.invalidateQueries({ queryKey: ['user-home-dashboard'] });
      showToast('success', 'Connection declined.');
    }
  });

  const cancelRequestMutation = useMutation({
    mutationFn: (connectionId) => connectionApi.cancelRequest(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outgoing-requests'] });
      queryClient.invalidateQueries({ queryKey: ['network-people'] });
      queryClient.invalidateQueries({ queryKey: ['user-home-dashboard'] });
      showToast('success', 'Connection request cancelled.');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to cancel request.');
    }
  });

  const removeConnMutation = useMutation({
    mutationFn: (connectionId) => connectionApi.removeConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-connections'] });
      showToast('success', 'Connection removed.');
    }
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Colleague Network</h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover colleagues across departments, exchange digital cards, and build internal connections.
          </p>
        </div>
      </div>

      {/* 2. 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          icon={UserCheck}
          iconBg="bg-purple-50 text-purple-600"
          title="My Connections"
          value={connectionsList.length}
          trend=""
          trendType="neutral"
          trendLabel="Connected colleagues"
        />
        <KpiCard
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
          title="Incoming Requests"
          value={incomingList.length}
          trend=""
          trendType="neutral"
          trendLabel="Awaiting your response"
        />
        <KpiCard
          icon={Users}
          iconBg="bg-blue-50 text-blue-600"
          title="Organization Members"
          value={peopleList.length || 'Org Wide'}
          trend=""
          trendType="neutral"
          trendLabel="Active enterprise directory"
        />
      </div>

      {/* 3. Navigation Tabs & Search */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl w-full sm:w-auto">
          {[
            { id: 'explore', label: 'Explore Directory', icon: Users },
            { id: 'connections', label: `My Connections (${connectionsList.length})`, icon: UserCheck },
            { id: 'requests', label: `Requests (${incomingList.length})`, icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === 'explore' && (
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search colleagues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 4. TAB CONTENT: EXPLORE */}
      {activeTab === 'explore' && (
        <div className="space-y-4">
          {isPeopleLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 bg-white rounded-3xl border border-slate-100">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p className="text-xs text-slate-400">Searching directory...</p>
            </div>
          ) : peopleList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 text-slate-400 text-xs">
              No colleagues found matching search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {peopleList.map((person) => {
                const slug = person.profileId?.slug || person.slug;
                const avatar =
                  person.profileId?.published?.avatarUrl ||
                  person.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop';
                const headline = person.profileId?.published?.headline || person.designation || 'Team Member';
                const isConnected = person.connectionStatus === 'accepted' || person.connectionStatus === 'connected';
                const isPendingSent = person.connectionStatus === 'pending_sent' || person.connectionStatus === 'pending';
                const isPendingReceived = person.connectionStatus === 'pending_received';

                return (
                  <div
                    key={person._id || person.userId}
                    className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
                  >
                    <div>
                      <div className="flex items-start gap-3.5">
                        <img
                          src={avatar}
                          alt={person.name}
                          className="w-14 h-14 rounded-2xl object-cover object-center border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-purple-600 transition-colors">
                            {person.name}
                          </h3>
                          <p className="text-xs text-purple-600 font-medium truncate">{headline}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                            <Building2 className="w-3 h-3" />
                            <span className="truncate">{person.departmentId?.name || 'Department'}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 mt-4 flex items-center justify-between gap-2">
                      {slug ? (
                        <a
                          href={`/p/${slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-purple-600"
                        >
                          <span>View Card</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span></span>
                      )}

                      {isConnected ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                          <Check className="w-3.5 h-3.5" /> Connected
                        </span>
                      ) : isPendingSent ? (
                        <button
                          onClick={() => cancelRequestMutation.mutate(person.connectionId || person.userId || person._id)}
                          disabled={cancelRequestMutation.isPending}
                          className="group flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-rose-50 text-amber-700 hover:text-rose-700 border border-amber-200 hover:border-rose-200 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                          title="Click to cancel connection request"
                        >
                          <span className="flex items-center gap-1.5 group-hover:hidden">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Sent</span>
                          </span>
                          <span className="hidden items-center gap-1.5 group-hover:flex text-rose-600">
                            <X className="w-3.5 h-3.5 text-rose-600" />
                            <span>Cancel</span>
                          </span>
                        </button>
                      ) : isPendingReceived ? (
                        <button
                          onClick={() => acceptRequestMutation.mutate(person.connectionId)}
                          disabled={acceptRequestMutation.isPending}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedRecipient(person)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
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
        </div>
      )}

      {/* 5. TAB CONTENT: MY CONNECTIONS */}
      {activeTab === 'connections' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Active Connections</h2>

          {isConnLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <p className="text-xs text-slate-400">Loading your connections...</p>
            </div>
          ) : connectionsList.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-400">
              You have no active connections yet. Head to "Explore Directory" to connect with colleagues!
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {connectionsList.map((conn, idx) => {
                const partner = conn.user || conn.partner || conn.otherUser || {};
                const slug = partner.profileId?.slug || partner.slug;
                const avatar = partner.avatarUrl || partner.profileId?.published?.avatarUrl || partner.profileId?.draft?.avatarUrl;
                const connId = conn._id || conn.connectionId;

                return (
                  <div key={connId || idx} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={partner.name || 'Colleague'}
                          className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                          {(partner.name || 'C').substring(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900">{partner.name || 'Colleague'}</p>
                        <p className="text-[11px] text-slate-500">{partner.designation || 'Team Member'}</p>
                        <p className="text-[10px] text-slate-400">{partner.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {slug && (
                        <a
                          href={`/p/${slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Digital Card</span>
                        </a>
                      )}
                      <button
                        onClick={() => removeConnMutation.mutate(connId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove Connection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB CONTENT: REQUESTS */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Incoming */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>Incoming Requests</span>
              <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                {incomingList.length}
              </span>
            </h2>

            {incomingList.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">No pending incoming requests.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {incomingList.map((req, idx) => {
                  const reqId = req._id || req.requestId || req.connectionId;
                  const avatar = req.requester?.avatarUrl || req.requester?.profileId?.published?.avatarUrl;

                  return (
                    <div key={reqId || idx} className="py-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={req.requester?.name || 'Colleague'}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                              {(req.requester?.name || req.requester?.email || 'C').substring(0, 1).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-900">{req.requester?.name || 'Colleague'}</p>
                            <p className="text-[11px] text-slate-400">{req.requester?.designation || req.requester?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => declineRequestMutation.mutate(reqId)}
                            className="px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => acceptRequestMutation.mutate(reqId)}
                            className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition-colors"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                      {req.note && <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl italic">"{req.note}"</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Outgoing */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <span>Sent Requests</span>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                {outgoingList.length}
              </span>
            </h2>

            {outgoingList.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">No sent requests pending.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {outgoingList.map((req, idx) => {
                  const reqId = req._id || req.requestId || req.connectionId;
                  const avatar = req.recipient?.avatarUrl || req.recipient?.profileId?.published?.avatarUrl;

                  return (
                    <div key={reqId || idx} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={req.recipient?.name || 'Colleague'}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                            {(req.recipient?.name || req.recipient?.email || 'C').substring(0, 1).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900">{req.recipient?.name || 'Colleague'}</p>
                          <p className="text-[11px] text-slate-400">{req.recipient?.designation || req.recipient?.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => cancelRequestMutation.mutate(reqId)}
                        className="px-2.5 py-1 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. MODAL: SEND CONNECTION REQUEST */}
      {selectedRecipient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Connect with Colleague</h3>
              <button onClick={() => setSelectedRecipient(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                {(selectedRecipient.name || 'C').substring(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{selectedRecipient.name}</p>
                <p className="text-[11px] text-slate-500">{selectedRecipient.designation || 'Team Member'}</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendRequestMutation.mutate({
                  recipientId: selectedRecipient.userId || selectedRecipient._id,
                  note: connectionNote
                });
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Add a personal note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={connectionNote}
                  onChange={(e) => setConnectionNote(e.target.value)}
                  placeholder="e.g. Hi! Would love to connect and exchange digital contact cards."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecipient(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendRequestMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm"
                >
                  {sendRequestMutation.isPending ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
