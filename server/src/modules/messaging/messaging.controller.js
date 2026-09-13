import { conversationService } from './conversation.service.js';
import { messageService } from './message.service.js';
import { chatFolderService } from './chatFolder.service.js';
import { uploadService } from '../upload/upload.service.js';
import { CompanyProfile } from '../company-profile/companyProfile.model.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';
import { BadRequestError } from '../../errors/index.js';
import {
  startDirectChatSchema,
  createGroupSchema,
  sendMessageSchema,
  updateGroupSchema,
  addParticipantSchema,
  createFolderSchema,
  updateFolderSchema,
  addFolderMembersSchema
} from './messaging.validation.js';

// Cache the singleton company ID
let _cachedCompanyId = null;
async function getCompanyId() {
  if (_cachedCompanyId) return _cachedCompanyId;
  const company = await CompanyProfile.findOne().select('_id').lean();
  if (company) _cachedCompanyId = company._id;
  return _cachedCompanyId;
}

class MessagingController {
  // ── Conversations ──────────────────────────────────────────────────

  async getConversations(req, res, next) {
    try {
      const userId = req.user._id;
      const companyId = await getCompanyId();

      const { conversations, totalItems, page, limit } = await conversationService.getUserConversations(
        userId,
        companyId,
        req.query
      );

      return ApiResponse.paginated(res, {
        data: conversations,
        pagination: {
          totalItems,
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit)
        },
        message: 'Conversations retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getConversationById(req, res, next) {
    try {
      const userId = req.user._id;
      const { id } = req.params;

      const conversation = await conversationService.getConversationById(id, userId);

      return ApiResponse.success(res, {
        data: conversation,
        message: 'Conversation retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async startDirectChat(req, res, next) {
    try {
      const result = startDirectChatSchema.safeParse(req.body);
      if (!result.success) {
        return ApiResponse.error(res, {
          statusCode: 422,
          message: 'Validation failed',
          details: result.error.issues
        });
      }

      const userId = req.user._id;
      const companyId = await getCompanyId();
      const { targetUserId } = result.data;

      const conversation = await conversationService.getOrCreateDirectConversation(
        userId,
        targetUserId,
        companyId
      );

      return ApiResponse.success(res, {
        data: conversation,
        message: 'Direct conversation ready'
      });
    } catch (error) {
      next(error);
    }
  }

  async createGroupChat(req, res, next) {
    try {
      const result = createGroupSchema.safeParse(req.body);
      if (!result.success) {
        return ApiResponse.error(res, {
          statusCode: 422,
          message: 'Validation failed',
          details: result.error.issues
        });
      }

      const createdBy = req.user._id;
      const companyId = await getCompanyId();
      const { name, description, participantIds } = result.data;

      const conversation = await conversationService.createGroupConversation({
        name,
        description,
        participantIds,
        createdBy,
        companyId
      });

      return ApiResponse.created(res, {
        data: conversation,
        message: 'Group conversation created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateGroupInfo(req, res, next) {
    try {
      const result = updateGroupSchema.safeParse(req.body);
      if (!result.success) {
        return ApiResponse.error(res, {
          statusCode: 422,
          message: 'Validation failed',
          details: result.error.issues
        });
      }

      const actorId = req.user._id;
      const { id } = req.params;

      const conversation = await conversationService.updateGroupInfo(id, result.data, actorId);

      return ApiResponse.success(res, {
        data: conversation,
        message: 'Group updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async addParticipant(req, res, next) {
    try {
      const result = addParticipantSchema.safeParse(req.body);
      if (!result.success) {
        return ApiResponse.error(res, {
          statusCode: 422,
          message: 'Validation failed',
          details: result.error.issues
        });
      }

      const actorId = req.user._id;
      const { id } = req.params;
      const { userId } = result.data;

      const conversation = await conversationService.addParticipant(id, userId, actorId);

      return ApiResponse.success(res, {
        data: conversation,
        message: 'Participant added successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async removeParticipant(req, res, next) {
    try {
      const actorId = req.user._id;
      const { id, userId } = req.params;

      const conversation = await conversationService.removeParticipant(id, userId, actorId);

      return ApiResponse.success(res, {
        data: conversation,
        message: 'Participant removed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Messages ──────────────────────────────────────────────────────

  async getMessages(req, res, next) {
    try {
      const userId = req.user._id;
      const { id: conversationId } = req.params;

      const result = await messageService.getMessages(conversationId, userId, req.query);

      return ApiResponse.paginated(res, {
        data: result.messages,
        pagination: result.pagination,
        message: 'Messages retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const validResult = sendMessageSchema.safeParse(req.body);
      if (!validResult.success) {
        return ApiResponse.error(res, {
          statusCode: 422,
          message: 'Validation failed',
          details: validResult.error.issues
        });
      }

      const senderId = req.user._id;
      const { id: conversationId } = req.params;
      const { content, contentType } = validResult.data;

      let attachments = [];

      // Handle file upload if a file was attached
      if (req.file) {
        const uploadResult = await uploadService.uploadFile({
          file: req.file,
          entityType: 'messages'
        });
        const resolvedType = req.file.mimetype.startsWith('image/') ? 'image' : 'file';
        attachments = [uploadResult];
        // Override contentType based on actual file
        validResult.data.contentType = resolvedType;
      }

      const message = await messageService.sendMessage({
        conversationId,
        senderId,
        content,
        contentType: attachments.length > 0 ? validResult.data.contentType : contentType,
        attachments
      });

      // Emit via Socket.IO if available
      const io = req.app.get('io');
      if (io) {
        io.to(`conversation:${conversationId}`).emit('new_message', message);
      }

      return ApiResponse.created(res, {
        data: message,
        message: 'Message sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      const userId = req.user._id;
      const { messageId } = req.params;

      const message = await messageService.deleteMessage(messageId, userId);

      // Notify room of deletion
      const io = req.app.get('io');
      if (io) {
        io.to(`conversation:${message.conversationId}`).emit('message_deleted', {
          messageId: message._id,
          conversationId: message.conversationId
        });
      }

      return ApiResponse.success(res, {
        data: message,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async markRead(req, res, next) {
    try {
      const userId = req.user._id;
      const { id: conversationId } = req.params;

      const result = await messageService.markConversationRead(conversationId, userId);

      return ApiResponse.success(res, {
        data: result,
        message: 'Conversation marked as read'
      });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const userId = req.user._id;
      const companyId = await getCompanyId();

      const count = await messageService.getUnreadCount(userId, companyId);

      return ApiResponse.success(res, {
        data: { unreadCount: count },
        message: 'Unread count retrieved'
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Folders ────────────────────────────────────────────────────────

  async getFolders(req, res, next) {
    try {
      const userId = req.user._id;
      const companyId = await getCompanyId();
      const folders = await chatFolderService.getUserFolders(userId, companyId);
      return ApiResponse.success(res, {
        data: folders,
        message: 'Folders retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async createFolder(req, res, next) {
    try {
      const userId = req.user._id;
      const companyId = await getCompanyId();
      const validated = createFolderSchema.parse(req.body);
      const folder = await chatFolderService.createFolder(userId, companyId, validated);
      return ApiResponse.created(res, {
        data: folder,
        message: 'Folder created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateFolder(req, res, next) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const validated = updateFolderSchema.parse(req.body);
      const folder = await chatFolderService.updateFolder(id, userId, validated);
      return ApiResponse.success(res, {
        data: folder,
        message: 'Folder updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteFolder(req, res, next) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      await chatFolderService.deleteFolder(id, userId);
      return ApiResponse.success(res, {
        message: 'Folder deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async addFolderMembers(req, res, next) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const validated = addFolderMembersSchema.parse(req.body);
      const folder = await chatFolderService.addMembers(id, userId, validated.memberIds);
      return ApiResponse.success(res, {
        data: folder,
        message: 'Members added to folder'
      });
    } catch (error) {
      next(error);
    }
  }

  async removeFolderMember(req, res, next) {
    try {
      const userId = req.user._id;
      const { id, memberId } = req.params;
      const folder = await chatFolderService.removeMember(id, userId, memberId);
      return ApiResponse.success(res, {
        data: folder,
        message: 'Member removed from folder'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const messagingController = new MessagingController();
