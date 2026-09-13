import { ChatFolder } from './chatFolder.model.js';
import { NotFoundError, BadRequestError, ConflictError } from '../../errors/index.js';

class ChatFolderService {
  /**
   * Get all folders belonging to a user, with populated member details
   */
  async getUserFolders(userId, companyId) {
    const query = { userId };
    if (companyId) {
      query.companyId = companyId;
    }

    return await ChatFolder.find(query)
      .populate('members', '_id name email avatarUrl designation department status')
      .sort({ createdAt: 1 })
      .lean();
  }

  /**
   * Create a new folder
   */
  async createFolder(userId, companyId, { name, color, memberIds = [] }) {
    const trimmedName = name?.trim();
    if (!trimmedName) {
      throw new BadRequestError('Folder name is required');
    }

    // Check duplicate name for this user
    const existing = await ChatFolder.findOne({
      userId,
      companyId,
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
    });

    if (existing) {
      throw new ConflictError(`Folder "${trimmedName}" already exists`);
    }

    // Deduplicate members
    const uniqueMemberIds = Array.from(new Set(memberIds || []));

    const folder = await ChatFolder.create({
      userId,
      companyId,
      name: trimmedName,
      color: color || '#8b5cf6',
      members: uniqueMemberIds
    });

    return await ChatFolder.findById(folder._id)
      .populate('members', '_id name email avatarUrl designation department status')
      .lean();
  }

  /**
   * Update folder details (name, color, members)
   */
  async updateFolder(folderId, userId, { name, color, memberIds }) {
    const folder = await ChatFolder.findOne({ _id: folderId, userId });
    if (!folder) {
      throw new NotFoundError('Folder not found');
    }

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        throw new BadRequestError('Folder name cannot be empty');
      }

      // Check if renamed to another existing folder
      const duplicate = await ChatFolder.findOne({
        _id: { $ne: folderId },
        userId,
        name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
      });
      if (duplicate) {
        throw new ConflictError(`Folder "${trimmedName}" already exists`);
      }
      folder.name = trimmedName;
    }

    if (color !== undefined) {
      folder.color = color;
    }

    if (memberIds !== undefined) {
      folder.members = Array.from(new Set(memberIds));
    }

    await folder.save();

    return await ChatFolder.findById(folder._id)
      .populate('members', '_id name email avatarUrl designation department status')
      .lean();
  }

  /**
   * Delete folder
   */
  async deleteFolder(folderId, userId) {
    const folder = await ChatFolder.findOneAndDelete({ _id: folderId, userId });
    if (!folder) {
      throw new NotFoundError('Folder not found');
    }
    return { success: true, folderId };
  }

  /**
   * Add members to folder
   */
  async addMembers(folderId, userId, memberIds) {
    const folder = await ChatFolder.findOne({ _id: folderId, userId });
    if (!folder) {
      throw new NotFoundError('Folder not found');
    }

    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      throw new BadRequestError('At least one member ID is required');
    }

    // Add unique member IDs
    const currentMemberIds = new Set(folder.members.map((m) => m.toString()));
    memberIds.forEach((id) => {
      if (id) currentMemberIds.add(id.toString());
    });

    folder.members = Array.from(currentMemberIds);
    await folder.save();

    return await ChatFolder.findById(folder._id)
      .populate('members', '_id name email avatarUrl designation department status')
      .lean();
  }

  /**
   * Remove member from folder
   */
  async removeMember(folderId, userId, memberId) {
    const folder = await ChatFolder.findOne({ _id: folderId, userId });
    if (!folder) {
      throw new NotFoundError('Folder not found');
    }

    folder.members = folder.members.filter((m) => m.toString() !== memberId.toString());
    await folder.save();

    return await ChatFolder.findById(folder._id)
      .populate('members', '_id name email avatarUrl designation department status')
      .lean();
  }
}

export const chatFolderService = new ChatFolderService();
