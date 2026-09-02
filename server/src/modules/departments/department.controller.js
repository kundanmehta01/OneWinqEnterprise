import { departmentService } from './department.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class DepartmentController {
  async getAllDepartments(req, res, next) {
    try {
      const includeArchived = req.query.includeArchived === 'true';
      const search = req.query.search || '';
      const departments = await departmentService.getAllDepartments({ includeArchived, search });
      return ApiResponse.success(res, { data: departments });
    } catch (error) {
      next(error);
    }
  }

  async getDepartmentById(req, res, next) {
    try {
      const department = await departmentService.getDepartmentById(req.params.id);
      return ApiResponse.success(res, { data: department });
    } catch (error) {
      next(error);
    }
  }

  async createDepartment(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const department = await departmentService.createDepartment(req.body, actorContext);
      return ApiResponse.created(res, {
        message: 'Department created successfully',
        data: department
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDepartment(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const department = await departmentService.updateDepartment(req.params.id, req.body, actorContext);
      return ApiResponse.success(res, {
        message: 'Department updated successfully',
        data: department
      });
    } catch (error) {
      next(error);
    }
  }

  async archiveDepartment(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const result = await departmentService.archiveDepartment(req.params.id, actorContext);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  async restoreDepartment(req, res, next) {
    try {
      const actorContext = {
        actorId: req.user._id,
        ipAddress: req.auditContext?.ipAddress,
        userAgent: req.auditContext?.userAgent,
        requestId: req.id
      };
      const department = await departmentService.restoreDepartment(req.params.id, actorContext);
      return ApiResponse.success(res, {
        message: 'Department restored successfully',
        data: department
      });
    } catch (error) {
      next(error);
    }
  }
}

export const departmentController = new DepartmentController();
