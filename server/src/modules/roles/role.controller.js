import { roleService } from './role.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class RoleController {
  async getAllRoles(req, res, next) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const roles = await roleService.getAllRoles({ includeInactive });
      return ApiResponse.success(res, { data: roles });
    } catch (error) {
      next(error);
    }
  }

  async getRoleById(req, res, next) {
    try {
      const role = await roleService.getRoleById(req.params.id);
      return ApiResponse.success(res, { data: role });
    } catch (error) {
      next(error);
    }
  }

  async createRole(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const role = await roleService.createRole(req.body, actorContext);
      return ApiResponse.created(res, {
        message: 'Role created successfully',
        data: role
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const role = await roleService.updateRole(req.params.id, req.body, actorContext);
      return ApiResponse.success(res, {
        message: 'Role updated successfully',
        data: role
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const result = await roleService.deleteRole(req.params.id, actorContext);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const roleController = new RoleController();
