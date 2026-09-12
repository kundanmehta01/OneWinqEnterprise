import { create } from 'zustand';
import { io } from 'socket.io-client';
import { messagingApi } from '../api/messagingApi';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useMessagingStore = create((set, get) => ({
  // State
  conversations: [],
  activeConversationId: null,
  messages: {}, // { [conversationId]: Message[] }
  typingUsers: {}, // { [conversationId]: { userId, name }[] }
  unreadCounts: {}, // { [conversationId]: number }
  totalUnread: 0,
  socket: null,
  isConnected: false,
  isLoadingConversations: false,
  isLoadingMessages: false,
  error: null,

  // ── Socket ────────────────────────────────────────────────────

  connectSocket: (accessToken) => {
    const existing = get().socket;
    if (existing?.connected) return;

    const socket = io(SOCKET_URL, {
      auth: { token: accessToken },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    socket.on('connect', () => {
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
      set({ isConnected: false });
    });

    // ── Incoming message ───────────────────────────────────────
    socket.on('new_message', (message) => {
      const conversationId = message.conversationId?.toString() || message.conversationId;
      const activeId = get().activeConversationId;

      set((state) => {
        const existing = state.messages[conversationId] || [];
        // Avoid duplicate messages
        const isDuplicate = existing.some((m) => m._id === message._id);
        const updatedMessages = isDuplicate ? existing : [...existing, message];

        // Update conversation lastMessage preview
        const updatedConversations = state.conversations.map((c) =>
          c._id === conversationId
            ? { ...c, lastMessage: { senderId: message.senderId, content: message.content, contentType: message.contentType, sentAt: message.createdAt } }
            : c
        );

        // Bump conversation to top
        const conv = updatedConversations.find((c) => c._id === conversationId);
        const rest = updatedConversations.filter((c) => c._id !== conversationId);
        const sorted = conv ? [conv, ...rest] : updatedConversations;

        // Increment unread if not the active conversation
        const newUnreadCounts = { ...state.unreadCounts };
        if (conversationId !== activeId) {
          newUnreadCounts[conversationId] = (newUnreadCounts[conversationId] || 0) + 1;
        }

        return {
          messages: { ...state.messages, [conversationId]: updatedMessages },
          conversations: sorted,
          unreadCounts: newUnreadCounts
        };
      });
    });

    // ── Message deleted ────────────────────────────────────────
    socket.on('message_deleted', ({ messageId, conversationId }) => {
      set((state) => {
        const msgs = (state.messages[conversationId] || []).map((m) =>
          m._id === messageId ? { ...m, isDeleted: true, content: '', attachments: [] } : m
        );
        return { messages: { ...state.messages, [conversationId]: msgs } };
      });
    });

    // ── Typing indicators ──────────────────────────────────────
    socket.on('user_typing', ({ conversationId, userId, name }) => {
      set((state) => {
        const current = state.typingUsers[conversationId] || [];
        if (current.some((u) => u.userId === userId)) return {};
        return {
          typingUsers: {
            ...state.typingUsers,
            [conversationId]: [...current, { userId, name }]
          }
        };
      });
    });

    socket.on('user_stopped_typing', ({ conversationId, userId }) => {
      set((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: (state.typingUsers[conversationId] || []).filter((u) => u.userId !== userId)
        }
      }));
    });

    // ── Read receipts ──────────────────────────────────────────
    socket.on('messages_read', ({ conversationId, userId, readAt }) => {
      // Could update message readBy arrays here; for MVP just log
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  // ── Conversations ────────────────────────────────────────────

  fetchConversations: async () => {
    set({ isLoadingConversations: true, error: null });
    try {
      const res = await messagingApi.getConversations();
      const conversations = res?.data || [];
      set({ conversations, isLoadingConversations: false });
    } catch (err) {
      set({ error: err.message, isLoadingConversations: false });
    }
  },

  openConversation: async (conversationId) => {
    set({ activeConversationId: conversationId });

    // Clear unread badge for this conversation
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [conversationId]: 0 }
    }));

    // Join socket room
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('join_conversation', { conversationId });
    }

    // Fetch messages if not already loaded
    const existingMessages = get().messages[conversationId];
    if (!existingMessages || existingMessages.length === 0) {
      await get().fetchMessages(conversationId);
    }

    // Mark as read
    try {
      await messagingApi.markRead(conversationId);
      if (socket?.connected) {
        socket.emit('mark_read', { conversationId });
      }
    } catch (_) {}
  },

  closeConversation: () => {
    const { activeConversationId, socket } = get();
    if (activeConversationId && socket?.connected) {
      socket.emit('leave_conversation', { conversationId: activeConversationId });
    }
    set({ activeConversationId: null });
  },

  // ── Messages ──────────────────────────────────────────────────

  fetchMessages: async (conversationId, params = {}) => {
    set({ isLoadingMessages: true });
    try {
      const res = await messagingApi.getMessages(conversationId, params);
      const messages = res?.data || [];
      set((state) => ({
        messages: { ...state.messages, [conversationId]: messages },
        isLoadingMessages: false
      }));
    } catch (err) {
      set({ error: err.message, isLoadingMessages: false });
    }
  },

  sendMessage: async (conversationId, { content, file }) => {
    const { socket } = get();

    // If text-only, prefer real-time socket for immediate delivery
    if (!file && content?.trim() && socket?.connected) {
      socket.emit('send_message', { conversationId, content: content.trim() });
      return;
    }

    // File upload or socket unavailable — fall back to REST
    try {
      const res = await messagingApi.sendMessage(conversationId, { content, file });
      const message = res?.data;
      if (message) {
        // The socket will broadcast back to us, but add locally if it doesn't
        set((state) => {
          const existing = state.messages[conversationId] || [];
          const isDuplicate = existing.some((m) => m._id === message._id);
          if (isDuplicate) return {};
          return { messages: { ...state.messages, [conversationId]: [...existing, message] } };
        });
      }
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteMessage: async (conversationId, messageId) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit('delete_message', { conversationId, messageId });
      return;
    }
    try {
      await messagingApi.deleteMessage(conversationId, messageId);
      set((state) => {
        const msgs = (state.messages[conversationId] || []).map((m) =>
          m._id === messageId ? { ...m, isDeleted: true, content: '', attachments: [] } : m
        );
        return { messages: { ...state.messages, [conversationId]: msgs } };
      });
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ── Group Management ─────────────────────────────────────────

  createDirectChat: async (targetUserId) => {
    const res = await messagingApi.startDirectChat(targetUserId);
    const conv = res?.data || res;
    if (conv && conv._id) {
      set((state) => {
        const exists = state.conversations.some((c) => c._id === conv._id);
        return {
          conversations: exists ? state.conversations : [conv, ...state.conversations]
        };
      });
    }
    return conv;
  },

  createGroupChat: async (data) => {
    const res = await messagingApi.createGroupChat(data);
    const conv = res?.data || res;
    if (conv && conv._id) {
      set((state) => ({ conversations: [conv, ...state.conversations] }));
    }
    return conv;
  },

  updateGroupInfo: async (conversationId, data) => {
    const res = await messagingApi.updateGroupInfo(conversationId, data);
    const conv = res?.data;
    if (conv) {
      set((state) => ({
        conversations: state.conversations.map((c) => (c._id === conversationId ? conv : c))
      }));
    }
    return conv;
  },

  addParticipant: async (conversationId, userId) => {
    const res = await messagingApi.addParticipant(conversationId, userId);
    const conv = res?.data;
    if (conv) {
      set((state) => ({
        conversations: state.conversations.map((c) => (c._id === conversationId ? conv : c))
      }));
    }
    return conv;
  },

  removeParticipant: async (conversationId, userId) => {
    const res = await messagingApi.removeParticipant(conversationId, userId);
    const conv = res?.data;
    if (conv) {
      set((state) => ({
        conversations: state.conversations.map((c) => (c._id === conversationId ? conv : c))
      }));
    }
    return conv;
  },

  // ── Typing ────────────────────────────────────────────────────

  setTyping: (conversationId, isTyping) => {
    const { socket } = get();
    if (!socket?.connected) return;
    socket.emit(isTyping ? 'typing_start' : 'typing_stop', { conversationId });
  },

  // ── Unread ────────────────────────────────────────────────────

  fetchTotalUnread: async () => {
    try {
      const res = await messagingApi.getUnreadCount();
      const count = res?.data?.unreadCount ?? 0;
      set({ totalUnread: count });
      return count;
    } catch (_) {
      return 0;
    }
  }
}));
