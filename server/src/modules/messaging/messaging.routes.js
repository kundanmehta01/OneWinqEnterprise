import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { messagingController } from './messaging.controller.js';

const router = Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(authenticate);

// ── Conversations ──────────────────────────────────────────────────
// GET  /me/messages/conversations                  — list all conversations
// POST /me/messages/conversations/direct           — start or get 1:1 DM
// POST /me/messages/conversations/group            — create group
// GET  /me/messages/conversations/unread-count     — total unread count
// GET  /me/messages/conversations/:id              — get single conversation
// PATCH /me/messages/conversations/:id             — update group info
// POST /me/messages/conversations/:id/participants — add member
// DELETE /me/messages/conversations/:id/participants/:userId — remove member
// POST /me/messages/conversations/:id/read         — mark all as read

router.get('/conversations', messagingController.getConversations.bind(messagingController));
router.post('/conversations/direct', messagingController.startDirectChat.bind(messagingController));
router.post('/conversations/group', messagingController.createGroupChat.bind(messagingController));
router.get('/conversations/unread-count', messagingController.getUnreadCount.bind(messagingController));
router.get('/conversations/:id', messagingController.getConversationById.bind(messagingController));
router.patch('/conversations/:id', messagingController.updateGroupInfo.bind(messagingController));
router.post('/conversations/:id/participants', messagingController.addParticipant.bind(messagingController));
router.delete('/conversations/:id/participants/:userId', messagingController.removeParticipant.bind(messagingController));
router.post('/conversations/:id/read', messagingController.markRead.bind(messagingController));

// ── Messages ──────────────────────────────────────────────────────
// GET    /me/messages/conversations/:id/messages          — paginated history
// POST   /me/messages/conversations/:id/messages          — send message (w/ optional file)
// DELETE /me/messages/conversations/:id/messages/:messageId — soft delete

router.get('/conversations/:id/messages', messagingController.getMessages.bind(messagingController));
router.post(
  '/conversations/:id/messages',
  uploadMiddleware.single('file'),
  messagingController.sendMessage.bind(messagingController)
);
router.delete('/conversations/:id/messages/:messageId', messagingController.deleteMessage.bind(messagingController));

// ── Folders ────────────────────────────────────────────────────────
// GET    /me/messages/folders                       — list user's folders
// POST   /me/messages/folders                       — create folder
// PATCH  /me/messages/folders/:id                   — update folder
// DELETE /me/messages/folders/:id                   — delete folder
// POST   /me/messages/folders/:id/members           — add members to folder
// DELETE /me/messages/folders/:id/members/:memberId — remove member from folder

router.get('/folders', messagingController.getFolders.bind(messagingController));
router.post('/folders', messagingController.createFolder.bind(messagingController));
router.patch('/folders/:id', messagingController.updateFolder.bind(messagingController));
router.delete('/folders/:id', messagingController.deleteFolder.bind(messagingController));
router.post('/folders/:id/members', messagingController.addFolderMembers.bind(messagingController));
router.delete('/folders/:id/members/:memberId', messagingController.removeFolderMember.bind(messagingController));

export const messagingRoutes = router;

