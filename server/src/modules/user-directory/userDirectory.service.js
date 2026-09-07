import { Department } from '../departments/department.model.js';
import { TeamMember } from '../team-members/teamMember.model.js';
import { companyProfileService } from '../company-profile/companyProfile.service.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { NotFoundError } from '../../errors/index.js';

class UserDirectoryService {
  async getDepartments() {
    const departments = await Department.find({ isArchived: false })
      .populate('headOfDepartment', 'name designation employeeId')
      .sort({ order: 1, name: 1 })
      .lean();

    const deptIds = departments.map((d) => d._id);
    const memberCounts = await TeamMember.aggregate([
      { $match: { departmentId: { $in: deptIds }, status: 'active' } },
      { $group: { _id: '$departmentId', count: { $sum: 1 } } }
    ]);

    const countMap = new Map(memberCounts.map((c) => [c._id.toString(), c.count]));

    return departments.map((d) => ({
      _id: d._id,
      name: d.name,
      slug: d.slug,
      description: d.description,
      head: d.headOfDepartment || null,
      memberCount: countMap.get(d._id.toString()) || 0,
      order: d.order
    }));
  }

  async getDepartmentById(id) {
    const department = await Department.findOne({ _id: id, isArchived: false })
      .populate('headOfDepartment', 'name designation employeeId')
      .lean();

    if (!department) {
      throw new NotFoundError('Department not found.');
    }

    const members = await TeamMember.find({ departmentId: id, status: 'active' })
      .populate('profileId', 'slug published.avatarUrl published.headline published.skills')
      .sort({ name: 1 })
      .lean();

    const formattedMembers = members.map((m) => ({
      _id: m._id,
      userId: m.userId,
      employeeId: m.employeeId,
      name: m.name,
      designation: m.designation,
      slug: m.profileId?.slug || '',
      avatarUrl: m.profileId?.published?.avatarUrl || '',
      headline: m.profileId?.published?.headline || '',
      skills: m.profileId?.published?.skills || []
    }));

    return {
      department: {
        _id: department._id,
        name: department.name,
        slug: department.slug,
        description: department.description,
        head: department.headOfDepartment || null,
        memberCount: formattedMembers.length
      },
      members: formattedMembers
    };
  }

  async getTeamDirectory(query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 12);
    const filter = { status: 'active' };

    if (query.departmentId) {
      filter.departmentId = query.departmentId;
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { designation: { $regex: query.search, $options: 'i' } }
      ];
    }

    const [members, totalItems] = await Promise.all([
      TeamMember.find(filter)
        .populate('departmentId', 'name')
        .populate('profileId', 'slug published.avatarUrl published.headline published.skills published.location')
        .sort(sort || { name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TeamMember.countDocuments(filter)
    ]);

    const formatted = members.map((m) => ({
      _id: m._id,
      userId: m.userId,
      employeeId: m.employeeId,
      name: m.name,
      designation: m.designation,
      department: m.departmentId?.name || '',
      departmentId: m.departmentId?._id || null,
      slug: m.profileId?.slug || '',
      avatarUrl: m.profileId?.published?.avatarUrl || '',
      headline: m.profileId?.published?.headline || '',
      skills: m.profileId?.published?.skills || [],
      location: m.profileId?.published?.location || ''
    }));

    return {
      members: formatted,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async getCompanyOverview() {
    return await companyProfileService.getPublicCompanyProfile();
  }
}

export const userDirectoryService = new UserDirectoryService();
