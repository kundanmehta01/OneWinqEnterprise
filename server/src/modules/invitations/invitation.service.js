import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Invitation } from './invitation.model.js';
import { User } from '../users/user.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { Role } from '../roles/role.model.js';
import { Department } from '../departments/department.model.js';
import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
import { Template } from '../templates/template.model.js';
import { templateResolverService } from '../templates/templateResolver.service.js';
import { templateService } from '../templates/template.service.js';
import { generateRandomToken, hashToken, generateAccessToken, generateRefreshToken } from '../../utils/token.util.js';
import { hashPassword } from '../../utils/hash.util.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { emailService } from '../../integrations/email/email.service.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';
import { env } from '../../config/env.config.js';
import { assertCanAssignRole } from '../../utils/rbacHierarchy.util.js';

class InvitationService {
  async getAllInvitations(query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 20);
    const filter = {};

    if (query.status) {
      filter.status = query.status;
    }
    if (query.search) {
      filter.$or = [
        { email: { $regex: query.search, $options: 'i' } },
        { name: { $regex: query.search, $options: 'i' } }
      ];
    }

    const [invitations, totalItems] = await Promise.all([
      Invitation.find(filter)
        .populate('roleId', 'name')
        .populate('departmentId', 'name')
        .populate('invitedBy', 'email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Invitation.countDocuments(filter)
    ]);

    return {
      invitations,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async getInvitationById(id) {
    const invitation = await Invitation.findById(id)
      .populate('roleId', 'name')
      .populate('departmentId', 'name')
      .populate('invitedBy', 'email')
      .lean();

    if (!invitation) {
      throw new NotFoundError('Invitation not found', ERROR_CODES.INVITATION_NOT_FOUND);
    }
    return invitation;
  }

  async createInvitation({ email, name, roleId, departmentId, designation }, inviterContext = {}) {
    const normalizedEmail = email.toLowerCase().trim();

    // Check existing pending invitation for this email
    const existingInvite = await Invitation.findOne({
      email: normalizedEmail,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });
    if (existingInvite) {
      throw new ConflictError('A pending invitation for this email address is already active.');
    }

    // Verify or find role
    let role = null;
    if (roleId && mongoose.Types.ObjectId.isValid(roleId)) {
      role = await Role.findById(roleId);
    }
    if (!role) {
      role = (await Role.findOne({ name: { $regex: /viewer|member|user|guest/i } })) || (await Role.findOne({ name: { $ne: 'Super Admin' } })) || (await Role.findOne());
      if (!role) {
        throw new NotFoundError('Selected role not found', ERROR_CODES.ROLE_NOT_FOUND);
      }
    }

    // Generic Hierarchy & Privilege Escalation Protection
    assertCanAssignRole(inviterContext, role);

    // Verify department if provided
    let department = null;
    if (departmentId && mongoose.Types.ObjectId.isValid(departmentId)) {
      department = await Department.findById(departmentId);
    }

    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await Invitation.create({
      email: normalizedEmail,
      name: name || '',
      roleId: role._id,
      departmentId: department ? department._id : null,
      designation: designation || 'Team Member',
      invitedBy: inviterContext.actorId,
      tokenHash,
      expiresAt,
      status: 'pending'
    });

    const inviteLink = `${env.FRONTEND_URL}/invite/${rawToken}`;
    const inviter = await User.findById(inviterContext.actorId).lean();

    try {
      await emailService.sendInvitationEmail({
        to: normalizedEmail,
        inviterName: inviter ? (inviter.name || inviter.email) : 'OneWinq Admin',
        inviteLink,
        companyName: 'OneWinq',
        designation: designation || 'Team Member'
      });
    } catch (emailErr) {
      console.warn('[InvitationService] Failed to send invitation email (proceeding with link generation):', emailErr?.message);
    }

    eventBus.emitEvent(APP_EVENTS.MEMBER_INVITED, {
      actorId: inviterContext.actorId,
      invitationId: invitation._id,
      email: normalizedEmail,
      context: inviterContext
    });

    return {
      ...invitation.toObject(),
      token: rawToken,
      inviteLink
    };
  }

  async verifyInvitationToken(token) {
    if (!token) {
      throw new BadRequestError('Invitation token is required.', ERROR_CODES.BAD_REQUEST);
    }
    const tokenHash = hashToken(token);
    const orClauses = [{ tokenHash }];
    if (mongoose.Types.ObjectId.isValid(token) && String(token).length === 24) {
      orClauses.push({ _id: token });
    }

    const invitation = await Invitation.findOne({
      $or: orClauses,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    })
      .populate('roleId', 'name')
      .populate('departmentId', 'name')
      .populate('invitedBy', 'email')
      .lean();

    if (!invitation) {
      throw new BadRequestError('Invitation token is invalid, expired, or has already been accepted.', ERROR_CODES.INVITATION_NOT_FOUND);
    }

    return {
      email: invitation.email,
      name: invitation.name,
      role: invitation.roleId?.name || 'Team Member',
      department: invitation.departmentId?.name || 'General',
      designation: invitation.designation || 'Team Member',
      expiresAt: invitation.expiresAt
    };
  }

  async acceptInvitation({ token, password, name, ipAddress = '', userAgent = '' }) {
    const tokenHash = hashToken(token);
    const orClauses = [{ tokenHash }];
    if (mongoose.Types.ObjectId.isValid(token) && String(token).length === 24) {
      orClauses.push({ _id: token });
    }

    const invitation = await Invitation.findOne({
      $or: orClauses,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      throw new BadRequestError('Invitation token is invalid or has expired.', ERROR_CODES.INVITATION_NOT_FOUND);
    }

    // Check if the invited email already has a registered account
    const existingUser = await User.findOne({ email: invitation.email });

    if (existingUser) {
      // --- EXISTING USER PATH: add to org without re-registration ---
      // Check if they already have a team member record (double-acceptance guard)
      const existingMember = await TeamMember.findOne({ userId: existingUser._id, isDeleted: { $ne: true } });
      if (existingMember) {
        throw new ConflictError('This user is already a member of the organization.');
      }

      const memberName = existingUser.name || name || invitation.name || invitation.email.split('@')[0];

      // Generate unique employee ID
      const memberCount = await TeamMember.countDocuments();
      const employeeId = `OWQ-${String(memberCount + 1).padStart(3, '0')}`;

      // Generate slug for profile
      let baseSlug = memberName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      let slug = baseSlug;
      let slugCounter = 1;
      while (await EmployeeProfile.findOne({ slug })) {
        slug = `${baseSlug}-${slugCounter}`;
        slugCounter++;
      }

      const defaultTemplate = await templateService.getDefaultTemplate();

      // Create TeamMember record
      const member = await TeamMember.create({
        userId: existingUser._id,
        employeeId,
        name: memberName,
        designation: invitation.designation,
        departmentId: invitation.departmentId,
        roleId: invitation.roleId,
        status: 'active',
        joiningDate: new Date()
      });

      // Resolve dynamic template (Role -> Designation -> Department -> Fallback)
      const inviteRole = invitation.roleId ? await Role.findById(invitation.roleId) : null;
      const inviteDept = invitation.departmentId ? await Department.findById(invitation.departmentId).populate('templateId') : null;
      let assignedTemplate = null;
      const resolved = await templateResolverService.resolveTemplateForMember({
        role: inviteRole,
        department: inviteDept,
        designation: invitation.designation
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
        assignedTemplate = defaultTemplate;
      }

      // Create EmployeeProfile for existing user
      const profile = await EmployeeProfile.create({
        memberId: member._id,
        userId: existingUser._id,
        slug,
        templateId: assignedTemplate._id,
        templateVersion: assignedTemplate.version || defaultTemplate.version,
        visibility: 'public',
        approvalStatus: 'approved',
        published: {
          headline: `${invitation.designation} at OneWinq`,
          bio: '',
          workEmail: existingUser.email,
          experience: [],
          skills: [],
          projects: [],
          achievements: [],
          socialLinks: []
        },
        draft: {
          headline: `${invitation.designation} at OneWinq`,
          bio: '',
          workEmail: existingUser.email,
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

      // Mark invitation as accepted
      invitation.status = 'accepted';
      invitation.acceptedAt = new Date();
      await invitation.save();

      // Issue tokens for existing user
      const familyId = uuidv4();
      const payload = { userId: existingUser._id.toString(), email: existingUser.email };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken({ ...payload, familyId });

      existingUser.refreshTokens.push({
        tokenHash: hashToken(refreshToken),
        familyId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ipAddress,
        userAgent,
        isRevoked: false
      });
      await existingUser.save();

      eventBus.emitEvent(APP_EVENTS.MEMBER_JOINED, {
        actorId: existingUser._id,
        memberId: member._id,
        email: existingUser.email,
        name: member.name
      });

      const userClean = existingUser.toObject();
      delete userClean.passwordHash;
      delete userClean.refreshTokens;

      return { user: userClean, member, profile, accessToken, refreshToken };
    }

    if (!password || password.length < 6) {
      throw new BadRequestError('Password must be at least 6 characters long.', ERROR_CODES.VALIDATION_ERROR);
    }

    const passwordHash = await hashPassword(password);
    const memberName = name || invitation.name || invitation.email.split('@')[0];

    // Generate unique employee ID
    const memberCount = await TeamMember.countDocuments();
    const employeeId = `OWQ-${String(memberCount + 1).padStart(3, '0')}`;

    // Generate base slug
    let baseSlug = memberName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let slug = baseSlug;
    let counter = 1;
    while (await EmployeeProfile.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Default template
    const defaultTemplate = await templateService.getDefaultTemplate();

    // 1. Create User
    const user = await User.create({
      email: invitation.email,
      passwordHash,
      status: 'active',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress
    });

    // 2. Create TeamMember
    const member = await TeamMember.create({
      userId: user._id,
      employeeId,
      name: memberName,
      designation: invitation.designation,
      departmentId: invitation.departmentId,
      roleId: invitation.roleId,
      status: 'active',
      joiningDate: new Date()
    });

    // Resolve dynamic template (Role -> Designation -> Department -> Fallback)
    const inviteRole = invitation.roleId ? await Role.findById(invitation.roleId) : null;
    const inviteDept = invitation.departmentId ? await Department.findById(invitation.departmentId).populate('templateId') : null;
    let assignedTemplate = null;
    const resolved = await templateResolverService.resolveTemplateForMember({
      role: inviteRole,
      department: inviteDept,
      designation: invitation.designation
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
      assignedTemplate = defaultTemplate;
    }

    // 3. Create EmployeeProfile
    const profile = await EmployeeProfile.create({
      memberId: member._id,
      userId: user._id,
      slug,
      templateId: assignedTemplate._id,
      templateVersion: assignedTemplate.version || defaultTemplate.version,
      visibility: 'public',
      approvalStatus: 'approved',
      published: {
        headline: `${invitation.designation} at OneWinq`,
        bio: '',
        workEmail: user.email,
        experience: [],
        skills: [],
        projects: [],
        achievements: [],
        socialLinks: []
      },
      draft: {
        headline: `${invitation.designation} at OneWinq`,
        bio: '',
        workEmail: user.email,
        experience: [],
        skills: [],
        projects: [],
        achievements: [],
        socialLinks: []
      }
    });

    // 4. Link profile to member
    member.profileId = profile._id;
    member.profileCompletionScore = profile.calculateCompletionScore();
    await member.save();

    // 5. Update invitation
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date();
    await invitation.save();

    // 6. Issue tokens
    const familyId = uuidv4();
    const payload = { userId: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ ...payload, familyId });

    user.refreshTokens.push({
      tokenHash: hashToken(refreshToken),
      familyId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress,
      userAgent,
      isRevoked: false
    });
    await user.save();

    eventBus.emitEvent(APP_EVENTS.MEMBER_JOINED, {
      actorId: user._id,
      memberId: member._id,
      email: user.email,
      name: member.name
    });

    const userClean = user.toObject();
    delete userClean.passwordHash;
    delete userClean.refreshTokens;

    return {
      user: userClean,
      member,
      profile,
      accessToken,
      refreshToken
    };
  }

  async resendInvitation(id, inviterContext = {}) {
    const invitation = await Invitation.findById(id);
    if (!invitation) {
      throw new NotFoundError('Invitation not found', ERROR_CODES.INVITATION_NOT_FOUND);
    }

    if (invitation.status === 'accepted') {
      throw new BadRequestError('This invitation has already been accepted.', ERROR_CODES.INVITATION_ALREADY_ACCEPTED);
    }

    const rawToken = generateRandomToken(32);
    invitation.tokenHash = hashToken(rawToken);
    invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    invitation.status = 'pending';
    await invitation.save();

    const inviteLink = `${env.FRONTEND_URL}/invite/${rawToken}`;
    const inviter = await User.findById(inviterContext.actorId).lean();

    try {
      await emailService.sendInvitationEmail({
        to: invitation.email,
        inviterName: inviter ? (inviter.name || inviter.email) : 'OneWinq Admin',
        inviteLink,
        companyName: 'OneWinq',
        designation: invitation.designation
      });
    } catch (emailErr) {
      console.warn('[InvitationService] Failed to send invitation email:', emailErr?.message);
    }

    eventBus.emitEvent(APP_EVENTS.MEMBER_INVITATION_RESENT, {
      actorId: inviterContext.actorId,
      invitationId: invitation._id,
      email: invitation.email,
      context: inviterContext
    });

    return {
      message: `Invitation resent successfully to ${invitation.email}`,
      token: rawToken,
      inviteLink
    };
  }

  async cancelInvitation(id, inviterContext = {}) {
    const invitation = await Invitation.findById(id);
    if (!invitation) {
      throw new NotFoundError('Invitation not found', ERROR_CODES.INVITATION_NOT_FOUND);
    }

    if (invitation.status === 'accepted') {
      throw new BadRequestError('Cannot cancel an invitation that has already been accepted.');
    }

    invitation.status = 'cancelled';
    await invitation.save();

    eventBus.emitEvent(APP_EVENTS.MEMBER_INVITATION_CANCELLED, {
      actorId: inviterContext.actorId,
      invitationId: invitation._id,
      email: invitation.email,
      context: inviterContext
    });

    return { message: `Invitation for ${invitation.email} has been cancelled.` };
  }
}

export const invitationService = new InvitationService();
