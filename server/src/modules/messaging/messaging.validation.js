import { z } from 'zod';

export const startDirectChatSchema = z.object({
  targetUserId: z.string().min(1, 'targetUserId is required')
});

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100),
  description: z.string().max(300).optional().default(''),
  participantIds: z.array(z.string()).min(1, 'At least one other participant required')
});

export const sendMessageSchema = z.object({
  content: z.string().max(4000).optional().default(''),
  contentType: z.enum(['text', 'image', 'file']).optional().default('text')
});

export const updateGroupSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(300).optional(),
  avatarUrl: z.string().url().optional()
});

export const addParticipantSchema = z.object({
  userId: z.string().min(1, 'userId is required')
});

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(60),
  color: z.string().optional(),
  memberIds: z.array(z.string()).optional().default([])
});

export const updateFolderSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  color: z.string().optional(),
  memberIds: z.array(z.string()).optional()
});

export const addFolderMembersSchema = z.object({
  memberIds: z.array(z.string()).min(1, 'At least one member ID is required')
});

