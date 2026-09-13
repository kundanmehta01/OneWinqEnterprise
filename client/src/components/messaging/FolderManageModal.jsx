import React, { useState, useEffect } from 'react';
import { X, Folder, Search, Check, Loader2, Users, Sparkles } from 'lucide-react';
import { connectionApi } from '../../api/connectionApi';
import { useMessagingStore } from '../../stores/messagingStore';

const COLOR_PRESETS = [
  { label: 'Purple', hex: '#8b5cf6', bg: 'bg-purple-500' },
  { label: 'Indigo', hex: '#6366f1', bg: 'bg-indigo-500' },
  { label: 'Blue', hex: '#3b82f6', bg: 'bg-blue-500' },
  { label: 'Emerald', hex: '#10b981', bg: 'bg-emerald-500' },
  { label: 'Amber', hex: '#f59e0b', bg: 'bg-amber-500' },
  { label: 'Rose', hex: '#f43f5e', bg: 'bg-rose-500' },
  { label: 'Teal', hex: '#14b8a6', bg: 'bg-teal-500' }
];

const SUGGESTED_NAMES = ['Senior', 'Leadership', 'Tech Leads', 'Designers', 'Project Core', 'Clients'];

export const FolderManageModal = ({ isOpen, onClose, folder = null, onSaved }) => {
  const { createFolder, updateFolder } = useMessagingStore();

  const isEditing = Boolean(folder && folder._id);

  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#8b5cf6');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedColleagues, setConnectedColleagues] = useState([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [isLoadingColleagues, setIsLoadingColleagues] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize or reset state when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (isEditing && folder) {
      setFolderName(folder.name || '');
      setSelectedColor(folder.color || '#8b5cf6');
      const existingIds = (folder.members || []).map((m) => (m._id || m).toString());
      setSelectedMemberIds(existingIds);
    } else {
      setFolderName('');
      setSelectedColor('#8b5cf6');
      setSelectedMemberIds([]);
    }
    setError('');
    setSearchQuery('');

    // Fetch connected colleagues
    const loadConnections = async () => {
      setIsLoadingColleagues(true);
      try {
        const res = await connectionApi.getMyConnections({ limit: 100 });
        const list = Array.isArray(res) ? res : res?.connections || res?.data || [];
        const users = list
          .map((c) => c.user || c.partner || c)
          .filter((u) => u && (u.userId || u._id));
        setConnectedColleagues(users);
      } catch (err) {
        setConnectedColleagues([]);
      } finally {
        setIsLoadingColleagues(false);
      }
    };

    loadConnections();
  }, [isOpen, folder, isEditing]);

  if (!isOpen) return null;

  const toggleMember = (targetUserId) => {
    const idStr = targetUserId.toString();
    setSelectedMemberIds((prev) =>
      prev.includes(idStr) ? prev.filter((id) => id !== idStr) : [...prev, idStr]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const trimmed = folderName.trim();
    if (!trimmed) {
      setError('Please provide a folder name');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      let savedFolder;
      if (isEditing) {
        savedFolder = await updateFolder(folder._id, {
          name: trimmed,
          color: selectedColor,
          memberIds: selectedMemberIds
        });
      } else {
        savedFolder = await createFolder({
          name: trimmed,
          color: selectedColor,
          memberIds: selectedMemberIds
        });
      }

      onSaved?.(savedFolder);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save folder');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredColleagues = connectedColleagues.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (c.name || '').toLowerCase();
    const role = (c.designation || '').toLowerCase();
    const dept = (c.department || '').toLowerCase();
    return name.includes(q) || role.includes(q) || dept.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-xs text-white"
              style={{ backgroundColor: selectedColor }}
            >
              <Folder className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isEditing ? 'Edit Chat Folder' : 'Create Chat Folder'}
              </h2>
              <p className="text-[11px] text-slate-500">
                Group connected colleagues (e.g. Senior, Leads) for one-click access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto flex flex-col p-6 gap-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Folder Name & Quick suggestions */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Folder Name</label>
            <input
              type="text"
              placeholder="e.g. Senior, Core Team, Management..."
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              maxLength={60}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-white placeholder-slate-400 font-medium transition-all"
              autoFocus
            />

            {/* Quick chips */}
            {!isEditing && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-purple-500" /> Suggestions:
                </span>
                {SUGGESTED_NAMES.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setFolderName(suggestion)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Folder Color</label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = selectedColor === preset.hex;
                return (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setSelectedColor(preset.hex)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${preset.bg} ${
                      isSelected ? 'ring-2 ring-offset-2 ring-slate-800 scale-110 shadow-sm' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={preset.label}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Members picker */}
          <div className="space-y-2 flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Connected Members</span>
              </label>
              <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                {selectedMemberIds.length} selected
              </span>
            </div>

            {/* Search filter for colleagues */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search colleagues to add..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-slate-400 transition-all"
              />
            </div>

            {/* Colleagues list */}
            <div className="border border-slate-100 rounded-2xl max-h-52 overflow-y-auto divide-y divide-slate-50 bg-slate-50/40 p-1">
              {isLoadingColleagues ? (
                <div className="py-8 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  <span className="text-[11px]">Loading connections...</span>
                </div>
              ) : connectedColleagues.length === 0 ? (
                <div className="py-6 px-4 text-center text-slate-400 text-xs">
                  No connected colleagues found. Connect with colleagues in the network first.
                </div>
              ) : filteredColleagues.length === 0 ? (
                <div className="py-6 px-4 text-center text-slate-400 text-xs">
                  No colleagues match "{searchQuery}".
                </div>
              ) : (
                filteredColleagues.map((c) => {
                  const id = (c.userId || c._id)?.toString();
                  const isChecked = selectedMemberIds.includes(id);
                  const avatar = c.avatarUrl;
                  const name = c.name || c.email?.split('@')[0] || 'Colleague';
                  const designation = c.designation || 'Team Member';
                  const department = c.department || '';

                  return (
                    <div
                      key={id}
                      onClick={() => toggleMember(id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                        isChecked ? 'bg-purple-50/80' : 'hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{name}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {designation}
                            {department && ` • ${department}`}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-purple-600 border-purple-600 text-white shadow-2xs'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Folder'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default FolderManageModal;
