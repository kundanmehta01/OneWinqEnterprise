import api from './axios';

const BASE = '/me/messages';

export const messagingApi = {
  // ── Conversations ──────────────────────────────────────────────
  getConversations: async (params = {}) => {
    const res = await api.get(`${BASE}/conversations`, { params });
    return res;
  },

  getConversationById: async (id) => {
    const res = await api.get(`${BASE}/conversations/${id}`);
    return res;
  },

  startDirectChat: async (targetUserId) => {
    const res = await api.post(`${BASE}/conversations/direct`, { targetUserId });
    return res;
  },

  createGroupChat: async ({ name, description, participantIds }) => {
    const res = await api.post(`${BASE}/conversations/group`, { name, description, participantIds });
    return res;
  },

  updateGroupInfo: async (id, data) => {
    const res = await api.patch(`${BASE}/conversations/${id}`, data);
    return res;
  },

  addParticipant: async (conversationId, userId) => {
    const res = await api.post(`${BASE}/conversations/${conversationId}/participants`, { userId });
    return res;
  },

  removeParticipant: async (conversationId, userId) => {
    const res = await api.delete(`${BASE}/conversations/${conversationId}/participants/${userId}`);
    return res;
  },

  markRead: async (conversationId) => {
    const res = await api.post(`${BASE}/conversations/${conversationId}/read`);
    return res;
  },

  getUnreadCount: async () => {
    const res = await api.get(`${BASE}/conversations/unread-count`);
    return res;
  },

  // ── Messages ──────────────────────────────────────────────────
  getMessages: async (conversationId, params = {}) => {
    const res = await api.get(`${BASE}/conversations/${conversationId}/messages`, { params });
    return res;
  },

  sendMessage: async (conversationId, { content, file }) => {
    // If a file is present, send as multipart form data
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      if (content) formData.append('content', content);
      const res = await api.post(`${BASE}/conversations/${conversationId}/messages`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res;
    }

    const res = await api.post(`${BASE}/conversations/${conversationId}/messages`, { content });
    return res;
  },

  deleteMessage: async (conversationId, messageId) => {
    const res = await api.delete(`${BASE}/conversations/${conversationId}/messages/${messageId}`);
    return res;
  }
};
