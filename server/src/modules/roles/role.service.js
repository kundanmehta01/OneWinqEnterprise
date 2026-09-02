import { Role } from './role.model.js';
import { Permission } from '../permissions/permission.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';

class RoleService {
  async getAllRoles({ includeInactive = false } = {}) {
    const filter = includeInactive ? {} : { isActive: true };
    return await Role.find(filter).sort({ isSystem: -1, name: 1 }).lean();
  }

  async getRoleById(id) {
    const role = await Role.findById(id).lean();
    if (!role) {
      throw new NotFoundError('Role not found', ERROR_CODES.ROLE_NOT_FOUND);
    }
    return role;
  }

  async getRoleBySlug(slug) {
    const role = await Role.findOne({ slug: slug.toLowerCase() }).lean();
    if (!role) {
      throw new NotFoundError(`Role '${slug}' not found`, ERROR_CODES.ROLE_NOT_FOUND);
    }
    return role;
  }

  async createRole({ name, description, permissions }, actorContext = {}) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingRole = await Role.findOne({ $or: [{ name }, { slug }] });
    if (existingRole) {
      throw new ConflictError(`A role with name '${name}' already exists.`);
    }

    // Validate that all permissions exist
    if (permissions && permissions.length > 0) {
      const validPermissions = await Permission.find({ code: { $in: permissions } }).select('code').lean();
      const validCodes = new Set(validPermissions.map((p) => p.code));
      const invalid = permissions.filter((code) => !validCodes.has(code));
      if (invalid.length > 0) {
        throw new BadRequestError(`Invalid permission code(s): ${invalid.join(', ')}`);
      }
    }

    const role = await Role.create({
      name,
      slug,
      description,
      permissions,
      isSystem: false,
      isActive: true
    });

    eventBus.emitEvent(APP_EVENTS.ROLE_CREATED, {
      actorId: actorContext.actorId,
      resourceId: role._id,
      roleName: role.name,
      context: actorContext
    });

    return role;
  }

  async updateRole(id, updateData, actorContext = {}) {
    const role = await Role.findById(id);
    if (!role) {
      throw new NotFoundError('Role not found', ERROR_CODES.ROLE_NOT_FOUND);
    }

    if (role.isSystem && updateData.name && updateData.name !== role.name) {
      throw new BadRequestError('Cannot rename system roles', ERROR_CODES.IMMUTABLE_SYSTEM_ROLE);
    }

    if (updateData.permissions && updateData.permissions.length > 0) {
      const validPermissions = await Permission.find({ code: { $in: updateData.permissions } }).select('code').lean();
      const validCodes = new Set(validPermissions.map((p) => p.code));
      const invalid = updateData.permissions.filter((code) => !validCodes.has(code));
      if (invalid.length > 0) {
        throw new BadRequestError(`Invalid permission code(s): ${invalid.join(', ')}`);
      }
    }

    const previousValue = role.toObject();

    if (updateData.name) {
      role.name = updateData.name;
      role.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (updateData.description !== undefined) role.description = updateData.description;
    if (updateData.permissions !== undefined) role.permissions = updateData.permissions;
    if (updateData.isActive !== undefined) {
      if (role.isSystem && updateData.isActive === false) {
        throw new BadRequestError('Cannot deactivate system roles', ERROR_CODES.IMMUTABLE_SYSTEM_ROLE);
      }
      role.isActive = updateData.isActive;
    }

    await role.save();

    eventBus.emitEvent(APP_EVENTS.ROLE_UPDATED, {
      actorId: actorContext.actorId,
      resourceId: role._id,
      previousValue,
      newValue: role.toObject(),
      context: actorContext
    });

    return role;
  }

  async deleteRole(id, actorContext = {}) {
    const role = await Role.findById(id);
    if (!role) {
      throw new NotFoundError('Role not found', ERROR_CODES.ROLE_NOT_FOUND);
    }

    if (role.isSystem) {
      throw new BadRequestError('Cannot delete system roles', ERROR_CODES.IMMUTABLE_SYSTEM_ROLE);
    }

    // Check if any active team member has this role
    const membersWithRole = await TeamMember.countDocuments({ roleId: id, status: { $ne: 'archived' } });
    if (membersWithRole > 0) {
      throw new BadRequestError(`Cannot delete role because it is assigned to ${membersWithRole} active team member(s).`);
    }

    await Role.findByIdAndDelete(id);

    eventBus.emitEvent(APP_EVENTS.ROLE_DELETED, {
      actorId: actorContext.actorId,
      resourceId: id,
      roleName: role.name,
      context: actorContext
    });

    return { message: `Role '${role.name}' successfully deleted` };
  }
}

export const roleService = new RoleService();
