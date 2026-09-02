import { auditLogService } from './auditLog.service.js';
import { ApiResponse } from '../../utils/apiResponse.util.js';

export class AuditLogController {
  async getAuditLogs(req, res, next) {
    try {
      const result = await auditLogService.getAuditLogs(req.query);
      return ApiResponse.paginated(res, {
        data: result.logs,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogById(req, res, next) {
    try {
      const log = await auditLogService.getAuditLogById(req.params.id);
      if (!log) {
        return ApiResponse.error(res, { statusCode: 404, message: 'Audit log entry not found' });
      }
      return ApiResponse.success(res, { data: log });
    } catch (error) {
      next(error);
    }
  }
}

export const auditLogController = new AuditLogController();
