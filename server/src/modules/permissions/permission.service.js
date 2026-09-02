import { Permission } from './permission.model.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

class PermissionService {
  async getAllPermissions() {
    return await Permission.find().sort({ module: 1, code: 1 }).lean();
  }

  async getPermissionsByModule() {
    const permissions = await Permission.find().sort({ module: 1, code: 1 }).lean();
    const grouped = {};
    for (const perm of permissions) {
      if (!grouped[perm.module]) {
        grouped[perm.module] = [];
      }
      grouped[perm.module].push(perm);
    }
    return grouped;
  }
}

export const permissionService = new PermissionService();

export class PermissionController {
  async getAllPermissions(req, res, next) {
    try {
      const permissions = await permissionService.getAllPermissions();
      return ApiResponse.success(res, { data: permissions });
    } catch (error) {
      next(error);
    }
  }

  async getPermissionsByModule(req, res, next) {
    try {
      const grouped = await permissionService.getPermissionsByModule();
      return ApiResponse.success(res, { data: grouped });
    } catch (error) {
      next(error);
    }
  }
}

export const permissionController = new PermissionController();
