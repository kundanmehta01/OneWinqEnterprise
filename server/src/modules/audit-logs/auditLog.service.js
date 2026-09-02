import { AuditLog } from './auditLog.model.js';
import { parsePagination, formatPaginationMeta } from '../../utils/pagination.util.js';
import { logger } from '../../config/logger.config.js';

const SENSITIVE_FIELDS = new Set(['password', 'passwordHash', 'token', 'refreshToken', 'tokenHash', 'apiKey', 'secret']);

const sanitizeAuditValue = (val) => {
  if (!val || typeof val !== 'object') return val;
  if (Array.isArray(val)) return val.map(sanitizeAuditValue);

  const clean = { ...val };
  for (const key of Object.keys(clean)) {
    if (SENSITIVE_FIELDS.has(key)) {
      clean[key] = '[REDACTED]';
    } else if (typeof clean[key] === 'object') {
      clean[key] = sanitizeAuditValue(clean[key]);
    }
  }
  return clean;
};

class AuditLogService {
  async log({ actorId, action, module, resourceType = '', resourceId = null, previousValue = null, newValue = null, ipAddress = '', userAgent = '', requestId = '' }) {
    try {
      const logEntry = await AuditLog.create({
        actorId: actorId || null,
        action,
        module,
        resourceType,
        resourceId: resourceId || null,
        previousValue: sanitizeAuditValue(previousValue),
        newValue: sanitizeAuditValue(newValue),
        ipAddress,
        userAgent,
        requestId,
        timestamp: new Date()
      });
      return logEntry;
    } catch (error) {
      logger.error(`[AuditLogService] Failed to record audit log: ${error.message}`, { error });
      return null;
    }
  }

  async getAuditLogs(query = {}) {
    const { page, limit, skip, sort } = parsePagination(query, 25);
    const filter = {};

    if (query.module) filter.module = query.module;
    if (query.action) filter.action = query.action;
    if (query.actorId) filter.actorId = query.actorId;
    if (query.resourceId) filter.resourceId = query.resourceId;

    if (query.startDate || query.endDate) {
      filter.timestamp = {};
      if (query.startDate) filter.timestamp.$gte = new Date(query.startDate);
      if (query.endDate) filter.timestamp.$lte = new Date(query.endDate);
    }

    const [logs, totalItems] = await Promise.all([
      AuditLog.find(filter)
        .populate('actorId', 'email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter)
    ]);

    return {
      logs,
      pagination: formatPaginationMeta(totalItems, page, limit)
    };
  }

  async getAuditLogById(id) {
    return await AuditLog.findById(id).populate('actorId', 'email').lean();
  }
}

export const auditLogService = new AuditLogService();
