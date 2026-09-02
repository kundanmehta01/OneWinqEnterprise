import { Department } from './department.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../errors/index.js';
import { ERROR_CODES } from '../../constants/errorCodes.constant.js';
import { eventBus } from '../../events/appEventBus.js';
import { APP_EVENTS } from '../../constants/events.constant.js';

class DepartmentService {
  async getAllDepartments({ includeArchived = false, search = '' } = {}) {
    const filter = {};
    if (!includeArchived) {
      filter.isArchived = false;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const departments = await Department.find(filter)
      .populate('headMemberId', 'name designation employeeId')
      .populate('parentDepartmentId', 'name slug')
      .sort({ order: 1, name: 1 })
      .lean();

    // Attach active member counts
    const memberCounts = await TeamMember.aggregate([
      { $match: { isArchived: false, status: { $ne: 'archived' } } },
      { $group: { _id: '$departmentId', count: { $sum: 1 } } }
    ]);

    const countMap = new Map();
    memberCounts.forEach((item) => {
      if (item._id) countMap.set(item._id.toString(), item.count);
    });

    return departments.map((dept) => ({
      ...dept,
      memberCount: countMap.get(dept._id.toString()) || 0
    }));
  }

  async getDepartmentById(id) {
    const department = await Department.findById(id)
      .populate('headMemberId', 'name designation employeeId')
      .populate('parentDepartmentId', 'name slug')
      .lean();

    if (!department) {
      throw new NotFoundError('Department not found', ERROR_CODES.DEPARTMENT_NOT_FOUND);
    }

    const memberCount = await TeamMember.countDocuments({ departmentId: id, isArchived: false });
    return { ...department, memberCount };
  }

  async createDepartment(data, actorContext = {}) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await Department.findOne({ $or: [{ name: data.name }, { slug }] });
    if (existing) {
      throw new ConflictError(`Department with name '${data.name}' already exists.`);
    }

    const department = await Department.create({
      ...data,
      slug
    });

    eventBus.emitEvent(APP_EVENTS.DEPARTMENT_CREATED, {
      actorId: actorContext.actorId,
      resourceId: department._id,
      departmentName: department.name,
      context: actorContext
    });

    return department;
  }

  async updateDepartment(id, updateData, actorContext = {}) {
    const department = await Department.findById(id);
    if (!department) {
      throw new NotFoundError('Department not found', ERROR_CODES.DEPARTMENT_NOT_FOUND);
    }

    const previousValue = department.toObject();

    if (updateData.name && updateData.name !== department.name) {
      const slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const existing = await Department.findOne({
        _id: { $ne: id },
        $or: [{ name: updateData.name }, { slug }]
      });
      if (existing) {
        throw new ConflictError(`Department with name '${updateData.name}' already exists.`);
      }
      department.name = updateData.name;
      department.slug = slug;
    }

    if (updateData.description !== undefined) department.description = updateData.description;
    if (updateData.headMemberId !== undefined) department.headMemberId = updateData.headMemberId;
    if (updateData.parentDepartmentId !== undefined) department.parentDepartmentId = updateData.parentDepartmentId;
    if (updateData.order !== undefined) department.order = updateData.order;
    if (updateData.isActive !== undefined) department.isActive = updateData.isActive;

    await department.save();

    eventBus.emitEvent(APP_EVENTS.DEPARTMENT_UPDATED, {
      actorId: actorContext.actorId,
      resourceId: department._id,
      previousValue,
      newValue: department.toObject(),
      context: actorContext
    });

    return department;
  }

  async archiveDepartment(id, actorContext = {}) {
    const department = await Department.findById(id);
    if (!department) {
      throw new NotFoundError('Department not found', ERROR_CODES.DEPARTMENT_NOT_FOUND);
    }

    const activeMembers = await TeamMember.countDocuments({
      departmentId: id,
      isArchived: false,
      status: { $ne: 'archived' }
    });

    if (activeMembers > 0) {
      throw new BadRequestError(
        `Cannot archive department with ${activeMembers} active team member(s). Please reassign them first.`,
        ERROR_CODES.DEPARTMENT_HAS_MEMBERS
      );
    }

    department.isArchived = true;
    department.isActive = false;
    department.archivedAt = new Date();
    department.archivedBy = actorContext.actorId;
    await department.save();

    eventBus.emitEvent(APP_EVENTS.DEPARTMENT_ARCHIVED, {
      actorId: actorContext.actorId,
      resourceId: department._id,
      departmentName: department.name,
      context: actorContext
    });

    return { message: `Department '${department.name}' has been archived` };
  }

  async restoreDepartment(id, actorContext = {}) {
    const department = await Department.findById(id);
    if (!department) {
      throw new NotFoundError('Department not found', ERROR_CODES.DEPARTMENT_NOT_FOUND);
    }

    department.isArchived = false;
    department.isActive = true;
    department.archivedAt = null;
    department.archivedBy = null;
    await department.save();

    return department;
  }
}

export const departmentService = new DepartmentService();
