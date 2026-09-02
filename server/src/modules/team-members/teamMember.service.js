import { TeamMember } from './teamMember.model.js';
import { User } from '../users/user.model.js';
import { Role } from '../roles/role.model.js';
import { Department } from '../departments/department.model.js';
import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
import { templateService } from '../templates/template.service.js';
import { hashPassword } from '../../utils/hash.util.js';
import { generateRandomToken } from '../../utils/token.util.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';

class TeamMemberService {
  async getAllTeamMembers(query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 20);
    const filter = {};

    if (!query.includeArchived) {
      filter.isArchived = false;
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
        .populate('roleId', 'name isSystem')
        .populate('profileId', 'slug visibility completionPercentage approvalStatus')
        .sort(sort)
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

  async getTeamMemberById(id) {
    const member = await TeamMember.findById(id)
      .populate('userId', 'email status emailVerified lastLoginAt')
      .populate('departmentId', 'name slug')
      .populate('roleId', 'name permissions isSystem')
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

    const defaultTemplate = await templateService.getDefaultTemplate();

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
      designation,
      departmentId: departmentId || null,
      roleId,
      status,
      joiningDate: joiningDate || new Date()
    });

    const profile = await EmployeeProfile.create({
      memberId: member._id,
      userId: user._id,
      slug,
      templateId: defaultTemplate._id,
      templateVersion: defaultTemplate.version,
      visibility: 'public',
      approvalStatus: 'approved',
      published: {
        headline: `${designation} at OneWinq`,
        bio: '',
        workEmail: user.email,
        experience: [],
        skills: [],
        projects: [],
        achievements: [],
        socialLinks: []
      },
      draft: {
        headline: `${designation} at OneWinq`,
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
    const member = await TeamMember.findById(id);
    if (!member) {
      throw new NotFoundError('Team member not found', ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    const previousValue = member.toObject();

    if (updateData.roleId) {
      const role = await Role.findById(updateData.roleId);
      if (!role) throw new NotFoundError('Role not found', ERROR_CODES.ROLE_NOT_FOUND);
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
    if (updateData.designation) member.designation = updateData.designation;
    if (updateData.joiningDate) member.joiningDate = updateData.joiningDate;

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

  async archiveTeamMember(id, actorContext = {}) {
    const member = await TeamMember.findById(id);
    if (!member) {
      throw new NotFoundError('Team member not found', ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    member.isArchived = true;
    member.status = 'archived';
    member.archivedAt = new Date();
    member.archivedBy = actorContext.actorId;
    await member.save();

    // Deactivate user account
    if (member.userId) {
      await User.findByIdAndUpdate(member.userId, { status: 'inactive' });
    }

    eventBus.emitEvent(APP_EVENTS.MEMBER_ARCHIVED, {
      actorId: actorContext.actorId,
      memberId: member._id,
      name: member.name,
      context: actorContext
    });

    return { message: `Team member '${member.name}' has been archived.` };
  }

  async restoreTeamMember(id, actorContext = {}) {
    const member = await TeamMember.findById(id);
    if (!member) {
      throw new NotFoundError('Team member not found', ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    member.isArchived = false;
    member.status = 'active';
    member.archivedAt = null;
    member.archivedBy = null;
    await member.save();

    if (member.userId) {
      await User.findByIdAndUpdate(member.userId, { status: 'active' });
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
