import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Invitation } from './invitation.model.js';
import { User } from '../users/user.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { Role } from '../roles/role.model.js';
import { Department } from '../departments/department.model.js';
import { EmployeeProfile } from '../employee-profile/employeeProfile.model.js';
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

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ConflictError(`A user with email '${normalizedEmail}' already has an active OneWinq account.`, ERROR_CODES.USER_ALREADY_EXISTS);
    }

    // Check existing pending invitation
    const existingInvite = await Invitation.findOne({
      email: normalizedEmail,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });
    if (existingInvite) {
      throw new ConflictError('A pending invitation for this email address is already active.');
    }

    // Verify role exists
    const role = await Role.findById(roleId);
    if (!role) {
      throw new NotFoundError('Selected role not found', ERROR_CODES.ROLE_NOT_FOUND);
    }

    // Verify department if provided
    let department = null;
    if (departmentId) {
      department = await Department.findById(departmentId);
      if (!department) {
        throw new NotFoundError('Selected department not found', ERROR_CODES.DEPARTMENT_NOT_FOUND);
      }
    }

    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await Invitation.create({
      email: normalizedEmail,
      name: name || '',
      roleId,
      departmentId: departmentId || null,
      designation: designation || 'Team Member',
      invitedBy: inviterContext.actorId,
      tokenHash,
      expiresAt,
      status: 'pending'
    });

    const inviteLink = `${env.FRONTEND_URL}/invite/accept?token=${rawToken}`;
    const inviter = await User.findById(inviterContext.actorId).lean();

    await emailService.sendInvitationEmail({
      to: normalizedEmail,
      inviterName: inviter ? inviter.email : 'OneWinq Admin',
      inviteLink,
      companyName: 'OneWinq',
      designation: designation || 'Team Member'
    });

    eventBus.emitEvent(APP_EVENTS.MEMBER_INVITED, {
      actorId: inviterContext.actorId,
      invitationId: invitation._id,
      email: normalizedEmail,
      context: inviterContext
    });

    return invitation;
  }

  async verifyInvitationToken(token) {
    const tokenHash = hashToken(token);
    const invitation = await Invitation.findOne({
      tokenHash,
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
      role: invitation.roleId?.name,
      department: invitation.departmentId?.name,
      designation: invitation.designation,
      expiresAt: invitation.expiresAt
    };
  }

  async acceptInvitation({ token, password, name, ipAddress = '', userAgent = '' }) {
    const tokenHash = hashToken(token);
    const invitation = await Invitation.findOne({
      tokenHash,
      status: 'pending',
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      throw new BadRequestError('Invitation token is invalid or has expired.', ERROR_CODES.INVITATION_NOT_FOUND);
    }

    // Double check email isn't registered
    const existingUser = await User.findOne({ email: invitation.email });
    if (existingUser) {
      throw new ConflictError('A user account with this email already exists.');
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

    // 3. Create EmployeeProfile
    const profile = await EmployeeProfile.create({
      memberId: member._id,
      userId: user._id,
      slug,
      templateId: defaultTemplate._id,
      templateVersion: defaultTemplate.version,
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

    const inviteLink = `${env.FRONTEND_URL}/invite/accept?token=${rawToken}`;
    const inviter = await User.findById(inviterContext.actorId).lean();

    await emailService.sendInvitationEmail({
      to: invitation.email,
      inviterName: inviter ? inviter.email : 'OneWinq Admin',
      inviteLink,
      companyName: 'OneWinq',
      designation: invitation.designation
    });

    eventBus.emitEvent(APP_EVENTS.MEMBER_INVITATION_RESENT, {
      actorId: inviterContext.actorId,
      invitationId: invitation._id,
      email: invitation.email,
      context: inviterContext
    });

    return { message: `Invitation resent successfully to ${invitation.email}` };
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
