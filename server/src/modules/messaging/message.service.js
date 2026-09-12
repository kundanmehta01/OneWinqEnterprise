import { Message } from './message.model.js';
import { Conversation } from './conversation.model.js';
import { conversationService } from './conversation.service.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../errors/index.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';

class MessageService {
  /**
   * Persist a new message and update conversation lastMessage snapshot.
   */
  async sendMessage({ conversationId, senderId, content, contentType = 'text', attachments = [] }) {
    // Validate membership
    const conversation = await Conversation.findOne({
      _id: conversationId,
      isActive: true,
      'participants.userId': senderId
    });

    if (!conversation) {
      throw new NotFoundError('Conversation not found or you are not a member');
    }

    if (!content?.trim() && attachments.length === 0) {
      throw new BadRequestError('Message must have content or an attachment');
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content: content?.trim() || '',
      contentType,
      attachments
    });

    // Populate sender info before returning
    await message.populate('senderId', 'email');

    // Update conversation lastMessage snapshot
    await conversationService.updateLastMessage(conversationId, {
      senderId,
      content: content?.trim() || (attachments[0]?.originalName ?? '[attachment]'),
      contentType,
      sentAt: message.createdAt
    });

    return message;
  }

  /**
   * Get paginated message history for a conversation (cursor/page-based).
   * Messages are returned oldest-first within the page for rendering.
   */
  async getMessages(conversationId, userId, query = {}) {
    // Verify membership
    const conversation = await Conversation.findOne({
      _id: conversationId,
      isActive: true,
      'participants.userId': userId
    });

    if (!conversation) {
      throw new NotFoundError('Conversation not found or you are not a member');
    }

    const { page, limit, skip } = parsePagination(query, 30);

    // Cursor-based: if `before` (ISO timestamp) is supplied, get older messages
    const filter = { conversationId };
    if (query.before) {
      filter.createdAt = { $lt: new Date(query.before) };
    }

    const [messages, totalItems] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('senderId', 'email')
        .lean(),
      Message.countDocuments(filter)
    ]);

    // Return in chronological order for display
    return {
      messages: messages.reverse(),
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  /**
   * Soft-delete a message (sender only).
   */
  async deleteMessage(messageId, userId) {
    const message = await Message.findById(messageId);

    if (!message) throw new NotFoundError('Message not found');
    if (message.isDeleted) throw new BadRequestError('Message is already deleted');

    if (message.senderId.toString() !== userId.toString()) {
      throw new ForbiddenError('You can only delete your own messages');
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.content = '';
    message.attachments = [];
    await message.save();

    return message;
  }

  /**
   * Mark all messages in a conversation as read for a given user.
   */
  async markConversationRead(conversationId, userId) {
    const now = new Date();

    // Update participant's lastReadAt in conversation
    await Conversation.findOneAndUpdate(
      { _id: conversationId, 'participants.userId': userId },
      { $set: { 'participants.$.lastReadAt': now } }
    );

    // Add read receipt to unread messages not yet read by this user
    await Message.updateMany(
      {
        conversationId,
        isDeleted: false,
        senderId: { $ne: userId },
        'readBy.userId': { $ne: userId }
      },
      { $push: { readBy: { userId, readAt: now } } }
    );

    return { markedAt: now };
  }

  /**
   * Get unread message count for a user across all their conversations.
   */
  async getUnreadCount(userId, companyId) {
    const conversations = await Conversation.find({
      companyId,
      isActive: true,
      'participants.userId': userId
    }).lean();

    let totalUnread = 0;

    for (const conv of conversations) {
      const participant = conv.participants.find((p) => p.userId.toString() === userId.toString());
      const lastReadAt = participant?.lastReadAt;

      const unreadFilter = {
        conversationId: conv._id,
        isDeleted: false,
        senderId: { $ne: userId }
      };

      if (lastReadAt) {
        unreadFilter.createdAt = { $gt: lastReadAt };
      }

      const count = await Message.countDocuments(unreadFilter);
      totalUnread += count;
    }

    return totalUnread;
  }
}

export const messageService = new MessageService();
