import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/token.util.js';
import { User } from '../modules/users/user.model.js';
import { TeamMember } from '../modules/team-members/teamMember.model.js';
import { Conversation } from '../modules/messaging/conversation.model.js';
import { CompanyProfile } from '../modules/company-profile/companyProfile.model.js';
import { registerSocketHandlers } from './socket.handler.js';
import { logger } from '../config/logger.config.js';
import { env } from '../config/env.config.js';

/**
 * Initialize Socket.IO server and attach it to the HTTP server.
 * Returns the io instance so it can be stored on app.
 */
export const initSocketServer = (httpServer, app) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [env.FRONTEND_URL, 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // ── JWT Auth Middleware ──────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication token is missing'));
      }

      const decoded = verifyAccessToken(token);
      if (!decoded?.userId) {
        return next(new Error('Invalid or expired token'));
      }

      const user = await User.findById(decoded.userId).select('_id email status').lean();
      if (!user || user.status === 'suspended' || user.status === 'inactive') {
        return next(new Error('User account is not active'));
      }

      const member = await TeamMember.findOne({
        userId: user._id,
        status: { $ne: 'archived' }
      })
        .select('name designation avatarUrl')
        .lean();

      // Single-tenant: resolve company ID from singleton CompanyProfile
      const company = await CompanyProfile.findOne().select('_id').lean();
      const companyId = company?._id?.toString() || null;

      socket.user = user;
      socket.member = member || null;
      socket.companyId = companyId;

      next();
    } catch (err) {
      logger.error(`[Socket] Auth error: ${err.message}`);
      next(new Error('Authentication failed'));
    }
  });

  // ── Connection Handler ───────────────────────────────────────────
  io.on('connection', async (socket) => {
    const userId = socket.user._id.toString();
    logger.info(`[Socket] User connected: ${userId} (socket: ${socket.id})`);

    // Auto-join all user's active conversation rooms
    try {
      const conversations = await Conversation.find({
        companyId: socket.companyId,
        isActive: true,
        'participants.userId': socket.user._id
      })
        .select('_id')
        .lean();

      const rooms = conversations.map((c) => `conversation:${c._id}`);
      if (rooms.length > 0) {
        socket.join(rooms);
        logger.info(`[Socket] User ${userId} auto-joined ${rooms.length} conversation rooms`);
      }
    } catch (err) {
      logger.error(`[Socket] Failed to auto-join rooms for user ${userId}: ${err.message}`);
    }

    // Register all event handlers
    registerSocketHandlers(io, socket);

    socket.on('disconnect', (reason) => {
      logger.info(`[Socket] User disconnected: ${userId} — ${reason}`);
    });
  });

  // Store io on app for use in HTTP controllers
  app.set('io', io);

  logger.info('[Socket] Socket.IO server initialized');
  return io;
};
