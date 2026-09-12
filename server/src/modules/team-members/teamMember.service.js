import { TeamMember } from './teamMember.model.js';
import { User } from '../users/user.model.js';
import { Role } from '../roles/role.model.js';
import { Department } from '../departments/department.model.js';
import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
import { Template } from '../templates/template.model.js';
import { templateResolverService } from '../templates/templateResolver.service.js';
import { templateService } from '../templates/template.service.js';
import { hashPassword } from '../../utils/hash.util.js';
import { generateRandomToken } from '../../utils/token.util.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, ConflictError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { emailService } from '../../integrations/email/email.service.js';
import { logger } from '../../config/logger.config.js';
import { assertCanAssignRole, assertCanMutateMember } from '../../utils/rbacHierarchy.util.js';

class TeamMemberService {
  async getAllTeamMembers(query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 20);
    const filter = {};

    if (!query.includeDeleted && !query.includeArchived) {
      filter.isDeleted = { $ne: true };
      filter.isArchived = { $ne: true };
    }
    if (!query.includeSystem) {
      filter.isSystem = { $ne: true };
    }
    if (query.departmentId) {
      filter.departmentId = query.departmentId;
    }
    if (query.roleId) {
      filter.roleId = query.roleId;
    }
    if (query.status) {
      filter.status = query.status;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { designation: { $regex: query.search, $options: 'i' } },
        { employeeId: { $regex: query.search, $options: 'i' } }
      ];
    }

    const [members, totalItems] = await Promise.all([
      TeamMember.find(filter)
        .populate('userId', 'email status lastLoginAt')
        .populate('departmentId', 'name slug')
        .populate('roleId', 'name permissions isSystem slug')
        .populate('profileId', 'slug published.avatarUrl draft.avatarUrl published.headline visibility completionPercentage approvalStatus')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      TeamMember.countDocuments(filter)
    ]);

    const enrichedMembers = members.map((m) => ({
      ...m,
      avatarUrl: m.avatarUrl || m.profileId?.published?.avatarUrl || m.profileId?.draft?.avatarUrl || ''
    }));

    return {
      members: enrichedMembers,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async getTeamMemberById(id) {
    const member = await TeamMember.findById(id)
      .populate('userId', 'email status emailVerified lastLoginAt')
      .populate('departmentId', 'name slug')
      .populate('roleId', 'name permissions isSystem slug')
      .populate('profileId')
      .lean();

    if (!member) {
      throw new NotFoundError('Team member not found', ERROR_CODES.RESOURCE_NOT_FOUND);
    }
    return member;
  }

  async createTeamMember({ email, password, name, employeeId, designation, departmentId, roleId, joiningDate, status = 'active' }, actorContext = {}) {
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ConflictError(`User with email '${normalizedEmail}' already exists.`, ERROR_CODES.USER_ALREADY_EXISTS);
    }

    const role = await Role.findById(roleId);
    if (!role) {
      throw new NotFoundError('Selected role not found', ERROR_CODES.ROLE_NOT_FOUND);
    }

    // Generic Hierarchy & Privilege Escalation Protection
    assertCanAssignRole(actorContext, role);

    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department) {
        throw new NotFoundError('Selected department not found', ERROR_CODES.DEPARTMENT_NOT_FOUND);
      }
    }

    // Auto-generate employeeId if not provided
    let empId = employeeId;
    if (!empId) {
      const memberCount = await TeamMember.countDocuments();
      empId = `OWQ-${String(memberCount + 1).padStart(3, '0')}`;
    }

    const existingEmpId = await TeamMember.findOne({ employeeId: empId.toUpperCase() });
    if (existingEmpId) {
      throw new ConflictError(`Employee ID '${empId}' is already assigned.`);
    }

    const initialPassword = password || generateRandomToken(12);
    const passwordHash = await hashPassword(initialPassword);

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      status,
      emailVerified: true,
      emailVerifiedAt: new Date()
    });

    const roleDoc = roleId ? await Role.findById(roleId) : null;
    const deptDoc = departmentId ? await Department.findById(departmentId).populate('templateId') : null;

    // Intelligently infer professional designation if empty or default 'Team Member'
    let finalDesignation = (designation || '').trim();
    if (!finalDesignation || finalDesignation.toLowerCase() === 'team member') {
      if (roleDoc?.name === 'HR Admin' || roleDoc?.slug?.includes('hr')) {
        finalDesignation = 'HR Administrator';
      } else if (roleDoc?.name === 'Super Admin' || roleDoc?.slug?.includes('super-admin')) {
        finalDesignation = 'Executive Director';
      } else if (roleDoc?.name === 'Admin') {
        finalDesignation = 'System Administrator';
      } else if (roleDoc?.name === 'Content Admin') {
        finalDesignation = 'Content Administrator';
      } else if (!finalDesignation) {
        finalDesignation = 'Team Member';
      }
    }

    // Resolve template dynamically (Role -> Designation -> Department -> Fallback)
    let assignedTemplate = null;
    const resolved = await templateResolverService.resolveTemplateForMember({
      role: roleDoc,
      department: deptDoc,
      designation: finalDesignation
    });
    if (resolved?._id) {
      assignedTemplate = await Template.findById(resolved._id);
    } else if (resolved?.category || resolved?.key) {
      const cat = resolved.category || resolved.key;
      assignedTemplate = await Template.findOne({
        $or: [{ category: cat }, { slug: `${cat}-profile` }, { slug: cat }]
      });
    }
    if (!assignedTemplate) {
      assignedTemplate = await templateService.getDefaultTemplate();
    }

    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await EmployeeProfile.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const member = await TeamMember.create({
      userId: user._id,
      employeeId: empId.toUpperCase(),
      name,
      designation: finalDesignation,
      departmentId: departmentId || null,
      roleId,
      status,
      joiningDate: joiningDate || new Date()
    });

    const profile = await EmployeeProfile.create({
      memberId: member._id,
      userId: user._id,
      slug,
      templateId: assignedTemplate._id,
      templateVersion: assignedTemplate.version || 1,
      visibility: 'public',
      approvalStatus: 'approved',
      published: {
        headline: `${finalDesignation} at OneWinq`,
        bio: '',
        workEmail: user.email,
        experience: [],
        skills: [],
        projects: [],
        achievements: [],
        socialLinks: []
      },
      draft: {
        headline: `${finalDesignation} at OneWinq`,
        bio: '',
        workEmail: user.email,
        experience: [],
        skills: [],
        projects: [],
        achievements: [],
        socialLinks: []
      }
    });

    member.profileId = profile._id;
    member.profileCompletionScore = profile.calculateCompletionScore();
    await member.save();

    eventBus.emitEvent(APP_EVENTS.MEMBER_JOINED, {
      actorId: actorContext.actorId,
      memberId: member._id,
      email: user.email,
      name: member.name,
      context: actorContext
    });

    // Send Welcome Email with credentials asynchronously (non-blocking)
    emailService.sendWelcomeCredentialsEmail({
      to: user.email,
      name: member.name,
      initialPassword
    }).catch((err) => {
      logger.warn(`[TeamMemberService] Failed to send welcome credentials email to ${user.email}: ${err.message}`);
    });

    const userObj = user.toObject();
    delete userObj.passwordHash;

    return {
      member,
      user: userObj,
      profile,
      initialPassword: password ? undefined : initialPassword
    };
  }

  async updateTeamMember(id, updateData, actorContext = {}) {
    const member = await TeamMember.findById(id).populate('roleId');
    if (!member) {
      throw new NotFoundError('Team member not found', ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    // Generic Hierarchy & Privileged Account Mutation Protection
    assertCanMutateMember(actorContext, member);

    const previousValue = member.toObject();

    if (updateData.roleId) {
      const role = await Role.findById(updateData.roleId);
      if (!role) throw new NotFoundError('Role not found', ERROR_CODES.ROLE_NOT_FOUND);

      // Generic Hierarchy & Privilege Escalation Protection
      assertCanAssignRole(actorContext, role);

      member.roleId = role._id;
    }

    if (updateData.departmentId !== undefined) {
      if (updateData.departmentId) {
        const department = await Department.findById(updateData.departmentId);
        if (!department) throw new NotFoundError('Department not found', ERROR_CODES.DEPARTMENT_NOT_FOUND);
        member.departmentId = department._id;
      } else {
        member.departmentId = null;
      }
    }

    if (updateData.name) member.name = updateData.name;
    if (updateData.employeeId) member.employeeId = updateData.employeeId;
    if (updateData.designation) member.designation = updateData.designation;
    if (updateData.joiningDate) member.joiningDate = updateData.joiningDate;

    // Automatically synchronize profile template & designation on role / dept change
    if ((updateData.roleId || updateData.departmentId !== undefined || updateData.designation) && member.profileId) {
      try {
        const roleDoc = member.roleId ? await Role.findById(member.roleId) : null;
        const deptDoc = member.departmentId ? await Department.findById(member.departmentId).populate('templateId') : null;

        let newAssignedTemplate = null;
        const resolved = await templateResolverService.resolveTemplateForMember({
          role: roleDoc,
          department: deptDoc,
          designation: member.designation
        });
        if (resolved?._id) {
          newAssignedTemplate = await Template.findById(resolved._id);
        } else if (resolved?.category || resolved?.key) {
          const cat = resolved.category || resolved.key;
          newAssignedTemplate = await Template.findOne({
            $or: [{ category: cat }, { slug: `${cat}-profile` }, { slug: cat }]
          });
        }

        if (newAssignedTemplate) {
          await EmployeeProfile.findByIdAndUpdate(member.profileId, {
            templateId: newAssignedTemplate._id,
            templateVersion: newAssignedTemplate.version || 1
          });
        }
      } catch (syncErr) {
        logger.warn(`Failed to sync profile template on member update: ${syncErr.message}`);
      }
    }

    if (updateData.status) {
      member.status = updateData.status;
      if (member.userId) {
        const userStatus = updateData.status === 'active' ? 'active' : 'inactive';
        await User.findByIdAndUpdate(member.userId, { status: userStatus });
      }
    }

    await member.save();

    eventBus.emitEvent(APP_EVENTS.MEMBER_UPDATED, {
      actorId: actorContext.actorId,
      memberId: member._id,
      previousValue,
      newValue: member.toObject(),
      context: actorContext
    });

    return member;
  }

  async getDeletedTeamMembers(query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 20);
    const filter = {
      $or: [
        { isDeleted: true },
        { status: 'deleted' },
        { isArchived: true },
        { status: 'archived' }
      ]
    };

    if (query.departmentId) {
      filter.departmentId = query.departmentId;
    }

    if (query.search) {
      filter.$and = [
        {
          $or: [
            { name: { $regex: query.search, $options: 'i' } },
            { designation: { $regex: query.search, $options: 'i' } },
            { employeeId: { $regex: query.search, $options: 'i' } }
          ]
        }
      ];
    }

    const [members, totalItems] = await Promise.all([
      TeamMember.find(filter)
        .populate('userId', 'email status lastLoginAt')
        .populate('departmentId', 'name slug')
        .populate('roleId', 'name isSystem')
        .populate('profileId', 'slug visibility completionPercentage approvalStatus')
        .populate('deletedBy', 'email')
        .populate('archivedBy', 'email')
        .sort(sort || { deletedAt: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TeamMember.countDocuments(filter)
    ]);

    return {
      members,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async deleteTeamMember(id, actorContext = {}, reason = '') {
    const member = await TeamMember.findById(id).populate('roleId');
    if (!member) {
      throw new NotFoundError('Team member not found', ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    // Generic Hierarchy & Privileged Account Mutation Protection
    assertCanMutateMember(actorContext, member);

    const now = new Date();
    member.isDeleted = true;
    member.status = 'deleted';
    member.deletedAt = now;
    member.deletedBy = actorContext.actorId || null;
    member.deletionReason = reason || '';

    // Backwards-compatible fields
    member.isArchived = true;
    member.archivedAt = now;
    member.archivedBy = actorContext.actorId || null;

    await member.save();

    // Deactivate user account so they cannot log in
    if (member.userId) {
      await User.findByIdAndUpdate(member.userId, { status: 'inactive' });
    }

    // Set employee profile to private so public digital card is hidden
    if (member.profileId) {
      await EmployeeProfile.findByIdAndUpdate(member.profileId, { visibility: 'private' });
    }

    eventBus.emitEvent(APP_EVENTS.MEMBER_DELETED, {
      actorId: actorContext.actorId,
      memberId: member._id,
      name: member.name,
      reason,
      context: actorContext
    });

    return { message: `Team member '${member.name}' has been deleted successfully.` };
  }

  async archiveTeamMember(id, actorContext = {}) {
    return await this.deleteTeamMember(id, actorContext);
  }

  async restoreTeamMember(id, actorContext = {}) {
    const member = await TeamMember.findById(id).populate('roleId');
    if (!member) {
      throw new NotFoundError('Team member not found', ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    // Generic Hierarchy & Privileged Account Mutation Protection
    assertCanMutateMember(actorContext, member);

    member.isDeleted = false;
    member.status = 'active';
    member.deletedAt = null;
    member.deletedBy = null;
    member.deletionReason = '';

    member.isArchived = false;
    member.archivedAt = null;
    member.archivedBy = null;

    await member.save();

    if (member.userId) {
      await User.findByIdAndUpdate(member.userId, { status: 'active' });
    }

    if (member.profileId) {
      await EmployeeProfile.findByIdAndUpdate(member.profileId, { visibility: 'public' });
    }

    eventBus.emitEvent(APP_EVENTS.MEMBER_RESTORED, {
      actorId: actorContext.actorId,
      memberId: member._id,
      name: member.name,
      context: actorContext
    });

    return member;
  }
}

export const teamMemberService = new TeamMemberService();
