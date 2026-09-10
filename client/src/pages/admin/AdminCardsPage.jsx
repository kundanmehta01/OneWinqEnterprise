import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CreditCard,
  Plus,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Link as LinkIcon,
  Unlink,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ExternalLink,
  Trash2,
  X,
  Layers,
  Check,
  Loader2,
  RefreshCw,
  Copy,
  Clock,
  UserCheck,
  UserX,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { cardApi } from '../../api/cardApi';
import { teamApi } from '../../api/teamApi';
import { KpiCard } from '../../components/common/KpiCard';
import { Pagination } from '../../components/common/Pagination';

export const AdminCardsPage = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCardForAssign, setSelectedCardForAssign] = useState(null);

  // Activation Link Popup Modal
  const [activationModalData, setActivationModalData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states
  const [newCardData, setNewCardData] = useState({
    cardUid: '',
    serialNumber: '',
    cardType: 'metal_black',
    batchNumber: 'BATCH-2026-01',
    notes: ''
  });

  const [bulkPrefix, setBulkPrefix] = useState('WINQ-NFC');
  const [bulkCount, setBulkCount] = useState(5);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [assignNotes, setAssignNotes] = useState('');

  // 1. Fetch Cards
  const { data: cardsResponse, isLoading } = useQuery({
    queryKey: ['admin-cards', page, pageSize, search, selectedStatus, selectedType],
    queryFn: async () => {
      const params = { page, limit: pageSize };
      if (search) params.search = search;
      if (selectedStatus !== 'all') params.status = selectedStatus;
      if (selectedType !== 'all') params.cardType = selectedType;
      const res = await cardApi.getAll(params);
      return res?.data || res;
    }
  });

  // 2. Fetch Card Stats
  const { data: statsResponse } = useQuery({
    queryKey: ['admin-cards-stats'],
    queryFn: async () => {
      const res = await cardApi.getStats();
      return res?.data || res;
    }
  });

  // 3. Fetch Team Members for assignment
  const { data: teamResponse } = useQuery({
    queryKey: ['admin-team-for-cards'],
    queryFn: async () => {
      const res = await teamApi.getAll({ limit: 150 });
      return res?.data || [];
    }
  });

  const cardsList = Array.isArray(cardsResponse)
    ? cardsResponse
    : cardsResponse?.cards || [];

  const pagination = cardsResponse?.pagination || {
    totalItems: cardsList.length,
    totalPages: Math.ceil(cardsList.length / pageSize) || 1,
    currentPage: page
  };

  const teamMembers = Array.isArray(teamResponse)
    ? teamResponse
    : teamResponse?.members || [];

  const stats = statsResponse || {
    total: cardsList.length,
    available: cardsList.filter((c) => c.status === 'available').length,
    pending: cardsList.filter((c) => c.status === 'activation_pending').length,
    active: cardsList.filter((c) => c.status === 'active').length,
    suspended: cardsList.filter((c) => c.status === 'suspended').length,
    deactivated: cardsList.filter((c) => c.status === 'deactivated').length
  };

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mutations
  const createCardMutation = useMutation({
    mutationFn: (data) => cardApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cards'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cards-stats'] });
      setIsAddModalOpen(false);
      setNewCardData({ cardUid: '', serialNumber: '', cardType: 'metal_black', batchNumber: 'BATCH-2026-01', notes: '' });
      showToast('success', 'NFC Smart Card registered as Available in inventory!');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to register card.');
    }
  });

  const createBulkMutation = useMutation({
    mutationFn: (cards) => cardApi.createBulk(cards),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-cards'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cards-stats'] });
      setIsBulkModalOpen(false);
      showToast('success', `${res?.insertedCount || bulkCount} Smart Cards added to Available inventory!`);
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Bulk card creation failed.');
    }
  });

  // Assign Card Mutation (Status: AVAILABLE -> ACTIVATION PENDING)
  const assignCardMutation = useMutation({
    mutationFn: (data) => cardApi.assign(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-cards'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cards-stats'] });
      setIsAssignModalOpen(false);
      setSelectedMemberId('');
      setAssignNotes('');

      const result = res?.data || res;
      if (result?.activationUrl) {
        setActivationModalData({
          cardUid: selectedCardForAssign?.cardUid,
          memberName: teamMembers.find((m) => m._id === selectedMemberId)?.name || 'Team Member',
          activationUrl: `${window.location.origin}${result.activationUrl}`,
          expiresAt: result.expiresAt
        });
      }
      setSelectedCardForAssign(null);
      showToast('success', 'Card assigned to member! Activation link generated.');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Card assignment failed.');
    }
  });

  // Unassign Card Mutation (Status -> AVAILABLE)
  const unassignCardMutation = useMutation({
    mutationFn: (data) => cardApi.unassign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cards'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cards-stats'] });
      setActiveMenuId(null);
      showToast('success', 'Card unassigned and returned to Available inventory.');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to unassign card.');
    }
  });

  // Generate / Regenerate Activation Link
  const generateLinkMutation = useMutation({
    mutationFn: (cardId) => cardApi.generateActivationLink(cardId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-cards'] });
      const result = res?.data || res;
      if (result?.activationUrl) {
        setActivationModalData({
          cardUid: result.cardUid,
          memberName: 'Team Member',
          activationUrl: `${window.location.origin}${result.activationUrl}`,
          expiresAt: result.expiresAt
        });
      }
      showToast('success', 'Fresh activation link generated!');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to generate activation link.');
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => cardApi.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cards'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cards-stats'] });
      setActiveMenuId(null);
      showToast('success', 'Card status updated.');
    },
    onError: (err) => {
      showToast('error', err?.response?.data?.message || 'Failed to update status.');
    }
  });

  const deleteCardMutation = useMutation({
    mutationFn: (id) => cardApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cards'] });
      queryClient.invalidateQueries({ queryKey: ['admin-cards-stats'] });
      setActiveMenuId(null);
      showToast('success', 'Card removed from inventory.');
    },
    onError: (err) => {
      setActiveMenuId(null);
      showToast('error', err?.response?.data?.message || 'Failed to delete card.');
    }
  });

  const handleBulkSubmit = (e) => {
    e.preventDefault();
    const batch = [];
    const rand = Math.floor(1000 + Math.random() * 9000);
    for (let i = 1; i <= Number(bulkCount); i++) {
      const uid = `${bulkPrefix}-${rand}-${String(i).padStart(3, '0')}`;
      batch.push({
        cardUid: uid,
        serialNumber: `SN-${uid}`,
        cardType: 'metal_black',
        batchNumber: `BATCH-${Date.now().toString().slice(-4)}`
      });
    }
    createBulkMutation.mutate(batch);
  };

  const handleCopyActivationUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    showToast('success', 'Activation link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getCardTypeLabel = (type) => {
    switch (type) {
      case 'metal_black':
        return 'Matte Black Metal';
      case 'metal_gold':
        return '24K Gold Metal';
      case 'metal_silver':
        return 'Brushed Silver Metal';
      case 'pvc_matte':
        return 'Matte PVC';
      case 'bamboo_wood':
        return 'Eco Bamboo Wood';
      default:
        return 'Smart NFC Card';
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
      case 'linked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
          </span>
        );
      case 'activation_pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" /> Activation Pending
          </span>
        );
      case 'available':
      case 'unassigned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3 h-3 text-blue-500" /> Available
          </span>
        );
      case 'suspended':
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <PauseCircle className="w-3 h-3 text-orange-500" /> Suspended
          </span>
        );
      case 'deactivated':
      case 'lost':
      case 'retired':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <UserX className="w-3 h-3 text-slate-400" /> Deactivated
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const statusTabs = [
    { id: 'all', label: 'All Cards', count: stats.total || pagination.totalItems },
    { id: 'available', label: 'Available', count: stats.available || 0 },
    { id: 'activation_pending', label: 'Activation Pending', count: stats.pending || 0 },
    { id: 'active', label: 'Active', count: stats.active || 0 },
    { id: 'suspended', label: 'Suspended', count: stats.suspended || 0 },
    { id: 'deactivated', label: 'Deactivated', count: stats.deactivated || 0 }
  ];

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
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">NFC Card Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage physical smart cards across the lifecycle: Available &rarr; Activation Pending &rarr; Active.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Bulk Batch</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm shadow-purple-200 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Card</span>
          </button>
        </div>
      </div>

      {/* 2. 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={CreditCard}
          iconBg="bg-purple-50 text-purple-600"
          title="Total Cards"
          value={stats.total || pagination.totalItems}
          trend=""
          trendType="neutral"
          trendLabel="All inventory hardware"
        />
        <KpiCard
          icon={Smartphone}
          iconBg="bg-blue-50 text-blue-600"
          title="Available Stock"
          value={stats.available || 0}
          trend=""
          trendType="neutral"
          trendLabel="Ready for user assignment"
        />
        <KpiCard
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
          title="Activation Pending"
          value={stats.pending || 0}
          trend=""
          trendType="neutral"
          trendLabel="Reserved for members"
        />
        <KpiCard
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
          title="Active Live Cards"
          value={stats.active || 0}
          trend=""
          trendType="neutral"
          trendLabel="Activated & tapped in field"
        />
      </div>

      {/* 3. Lifecycle Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {statusTabs.map((tab) => {
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedStatus(tab.id);
                setPage(1);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/70'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? 'bg-purple-700/60 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Toolbar & Filter Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search UID, serial, or member..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="all">All Card Materials</option>
              <option value="metal_black">Matte Black Metal</option>
              <option value="metal_gold">24K Gold Metal</option>
              <option value="metal_silver">Brushed Silver Metal</option>
              <option value="pvc_matte">Matte PVC</option>
              <option value="bamboo_wood">Bamboo Wood</option>
            </select>
          </div>
        </div>

        {/* 5. Table */}
        <div className="overflow-x-auto min-h-[250px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <p className="text-xs text-slate-400">Loading card inventory...</p>
            </div>
          ) : cardsList.length === 0 ? (
            <div className="text-center py-16">
              <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No cards in this category</p>
              <p className="text-xs text-slate-400 mt-1">Register new NFC hardware cards or change filter tab.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl"
              >
                + Register First Card
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Card ID / Serial</th>
                  <th className="py-3 px-3">Material & Batch</th>
                  <th className="py-3 px-3">Owner / Member</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Taps</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
                {cardsList.map((card) => {
                  const member = card.memberId || card.member;
                  const isAvailable = card.status === 'available';
                  const isPending = card.status === 'activation_pending';
                  const isActive = card.status === 'active';
                  const isSuspended = card.status === 'suspended';

                  return (
                    <tr key={card._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                            NFC
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 font-mono">{card.cardUid}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{card.serialNumber || 'SN--'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-medium text-slate-800">{getCardTypeLabel(card.cardType)}</p>
                        <p className="text-[10px] text-slate-400">{card.batchNumber || 'Standard Batch'}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        {member ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center">
                              {member.name ? member.name.substring(0, 1).toUpperCase() : 'M'}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{member.name}</p>
                              <p className="text-[10px] text-slate-400">
                                {member.designation || 'Member'}{' '}
                                {member.employeeId ? `• ${member.employeeId}` : ''}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3">{renderStatusBadge(card.status)}</td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-purple-600">{card.tapCount || 0}</span>
                        <span className="text-[10px] text-slate-400 ml-1">taps</span>
                      </td>
                      <td className="py-3.5 px-3 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Lifecycle Action Buttons */}
                          {isAvailable && (
                            <button
                              onClick={() => {
                                setSelectedCardForAssign(card);
                                setIsAssignModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold flex items-center gap-1 border border-purple-200 transition-colors"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Assign Card</span>
                            </button>
                          )}

                          {isPending && (
                            <button
                              onClick={() => generateLinkMutation.mutate(card._id)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-semibold flex items-center gap-1 border border-amber-200 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Get Link</span>
                            </button>
                          )}

                          {isActive && card.profile?.slug && (
                            <a
                              href={`/p/${card.profile.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1 border border-slate-200 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Profile</span>
                            </a>
                          )}

                          {/* Overflow Menu */}
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === card._id ? null : card._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Dropdown Menu */}
                        {activeMenuId === card._id && (
                          <div className="absolute right-3 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 text-xs text-left animate-in fade-in">
                            {isAvailable ? (
                              <button
                                onClick={() => {
                                  setSelectedCardForAssign(card);
                                  setIsAssignModalOpen(true);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-purple-50 text-purple-700 font-semibold"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> Assign to Member
                              </button>
                            ) : (
                              <button
                                onClick={() => unassignCardMutation.mutate({ cardId: card._id })}
                                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-amber-50 text-amber-700 font-semibold"
                              >
                                <Unlink className="w-3.5 h-3.5" /> Unassign Card
                              </button>
                            )}

                            {isPending && (
                              <button
                                onClick={() => {
                                  generateLinkMutation.mutate(card._id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 text-slate-700"
                              >
                                <Copy className="w-3.5 h-3.5" /> Resend Activation Link
                              </button>
                            )}

                            {isActive && (
                              <button
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    id: card._id,
                                    status: 'suspended'
                                  })
                                }
                                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-orange-50 text-orange-700"
                              >
                                <PauseCircle className="w-3.5 h-3.5" /> Suspend Card
                              </button>
                            )}

                            {isSuspended && (
                              <button
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    id: card._id,
                                    status: 'active'
                                  })
                                }
                                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-emerald-50 text-emerald-700"
                              >
                                <PlayCircle className="w-3.5 h-3.5" /> Unsuspend / Activate
                              </button>
                            )}

                            <button
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: card._id,
                                  status: card.status === 'deactivated' ? 'available' : 'deactivated'
                                })
                              }
                              className="w-full px-3 py-2 flex items-center gap-2 hover:bg-slate-50 text-slate-700"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {card.status === 'deactivated' ? 'Restore to Available' : 'Deactivate'}
                            </button>

                            <button
                              onClick={() => deleteCardMutation.mutate(card._id)}
                              className="w-full px-3 py-2 flex items-center gap-2 hover:bg-rose-50 text-rose-600 border-t border-slate-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove Hardware
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 6. Pagination */}
        {cardsList.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pageSize}
            itemName="smart cards"
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(sz) => {
              setPageSize(sz);
              setPage(1);
            }}
          />
        )}
      </div>

      {/* 7. MODAL: ASSIGN CARD TO USER */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Assign Card to Member</h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs space-y-1">
              <p className="text-purple-600 font-semibold">Selected Smart Card:</p>
              <p className="font-bold text-slate-900 font-mono text-sm">{selectedCardForAssign?.cardUid}</p>
              <p className="text-[11px] text-slate-500">
                The card will move to <strong>Activation Pending</strong> status. A secure activation URL will be generated for the member.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!selectedMemberId) return;
                assignCardMutation.mutate({
                  cardId: selectedCardForAssign._id,
                  memberId: selectedMemberId,
                  notes: assignNotes
                });
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Team Member</label>
                <select
                  required
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none bg-white"
                >
                  <option value="">-- Choose Member --</option>
                  {teamMembers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} ({m.designation || 'Member'}) - {m.employeeId}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Optional Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Issued for Q3 client visits"
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignCardMutation.isPending || !selectedMemberId}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {assignCardMutation.isPending ? 'Assigning...' : 'Assign & Generate Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. POPUP: ACTIVATION URL MODAL (Generated upon assignment or resend) */}
      {activationModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Card Activation Link Ready</h3>
                  <p className="text-[11px] text-slate-500">Secure link for {activationModalData.memberName}</p>
                </div>
              </div>
              <button
                onClick={() => setActivationModalData(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Send this single-use activation link to <strong>{activationModalData.memberName}</strong>. They will log in and click <strong>Activate Card</strong> to bind this card to their enterprise digital profile.
            </p>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
              <input
                type="text"
                readOnly
                value={activationModalData.activationUrl}
                className="bg-transparent text-xs text-slate-800 font-mono w-full focus:outline-none select-all"
              />
              <button
                onClick={() => handleCopyActivationUrl(activationModalData.activationUrl)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActivationModalData(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL: REGISTER SINGLE CARD */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Register Physical NFC Card</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createCardMutation.mutate(newCardData);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card UID (Hardware ID)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WINQ-HXL5QD"
                  value={newCardData.cardUid}
                  onChange={(e) => setNewCardData({ ...newCardData, cardUid: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Serial Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SN-OWQ-2026-001"
                  value={newCardData.serialNumber}
                  onChange={(e) => setNewCardData({ ...newCardData, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Card Material</label>
                  <select
                    value={newCardData.cardType}
                    onChange={(e) => setNewCardData({ ...newCardData, cardType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none bg-white"
                  >
                    <option value="metal_black">Matte Black Metal</option>
                    <option value="metal_gold">24K Gold Metal</option>
                    <option value="metal_silver">Brushed Silver Metal</option>
                    <option value="pvc_matte">Matte PVC</option>
                    <option value="bamboo_wood">Bamboo Wood</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Batch Code</label>
                  <input
                    type="text"
                    value={newCardData.batchNumber}
                    onChange={(e) => setNewCardData({ ...newCardData, batchNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
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
                  disabled={createCardMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  {createCardMutation.isPending ? 'Registering...' : 'Register as Available'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. MODAL: BULK BATCH GENERATION */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Batch Card Registration</h3>
              <button onClick={() => setIsBulkModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card UID Prefix</label>
                <input
                  type="text"
                  required
                  value={bulkPrefix}
                  onChange={(e) => setBulkPrefix(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Batch Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={bulkCount}
                  onChange={(e) => setBulkCount(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none font-semibold"
                />
                <p className="text-[11px] text-slate-400 mt-1">Registers cards with initial status <strong>Available</strong>.</p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBulkMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  {createBulkMutation.isPending ? 'Generating...' : `Create ${bulkCount} Available Cards`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
