import { messageService } from '../modules/messaging/message.service.js';
import { conversationService } from '../modules/messaging/conversation.service.js';
import { Conversation } from '../modules/messaging/conversation.model.js';
import { logger } from '../config/logger.config.js';

/**
 * Register all Socket.IO event handlers for a connected socket.
 */
export const registerSocketHandlers = (io, socket) => {
  const userId = socket.user._id.toString();

  // ── join_conversation ──────────────────────────────────────────
  // Client joins a specific conversation room (e.g. when opening a chat)
  socket.on('join_conversation', async ({ conversationId }) => {
    try {
      // Verify membership before joining
      const conversation = await Conversation.findOne({
        _id: conversationId,
        isActive: true,
        'participants.userId': socket.user._id
      }).lean();

      if (!conversation) {
        return socket.emit('error', { message: 'Conversation not found or access denied' });
      }

      const room = `conversation:${conversationId}`;
      socket.join(room);
      socket.emit('joined_conversation', { conversationId });
    } catch (err) {
      logger.error(`[Socket] join_conversation error: ${err.message}`);
      socket.emit('error', { message: 'Failed to join conversation' });
    }
  });

  // ── leave_conversation ─────────────────────────────────────────
  socket.on('leave_conversation', ({ conversationId }) => {
    const room = `conversation:${conversationId}`;
    socket.leave(room);
  });

  // ── send_message ───────────────────────────────────────────────
  // Text-only real-time sends; file uploads go through the REST endpoint
  socket.on('send_message', async ({ conversationId, content, contentType = 'text' }) => {
    try {
      if (!content?.trim()) {
        return socket.emit('error', { message: 'Message content cannot be empty' });
      }

      const message = await messageService.sendMessage({
        conversationId,
        senderId: socket.user._id,
        content: content.trim(),
        contentType,
        attachments: []
      });

      const room = `conversation:${conversationId}`;

      // Broadcast to everyone in the room (including sender)
      io.to(room).emit('new_message', message);

      // Ack to sender
      socket.emit('message_sent', { tempId: null, message });
    } catch (err) {
      logger.error(`[Socket] send_message error: ${err.message}`);
      socket.emit('error', { message: err.message || 'Failed to send message' });
    }
  });

  // ── delete_message ─────────────────────────────────────────────
  socket.on('delete_message', async ({ messageId, conversationId }) => {
    try {
      const message = await messageService.deleteMessage(messageId, socket.user._id);

      io.to(`conversation:${conversationId}`).emit('message_deleted', {
        messageId: message._id,
        conversationId
      });
    } catch (err) {
      logger.error(`[Socket] delete_message error: ${err.message}`);
      socket.emit('error', { message: err.message || 'Failed to delete message' });
    }
  });

  // ── typing_start ───────────────────────────────────────────────
  socket.on('typing_start', ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit('user_typing', {
      conversationId,
      userId,
      name: socket.member?.name || socket.user.email
    });
  });

  // ── typing_stop ────────────────────────────────────────────────
  socket.on('typing_stop', ({ conversationId }) => {
    socket.to(`conversation:${conversationId}`).emit('user_stopped_typing', {
      conversationId,
      userId
    });
  });

  // ── mark_read ──────────────────────────────────────────────────
  socket.on('mark_read', async ({ conversationId }) => {
    try {
      await messageService.markConversationRead(conversationId, socket.user._id);

      // Notify other members that this user has read
      socket.to(`conversation:${conversationId}`).emit('messages_read', {
        conversationId,
        userId,
        readAt: new Date().toISOString()
      });
    } catch (err) {
      logger.error(`[Socket] mark_read error: ${err.message}`);
    }
  });
};
