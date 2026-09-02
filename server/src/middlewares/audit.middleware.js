export const auditContextMiddleware = (req, res, next) => {
  req.auditContext = {
    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || '127.0.0.1',
    userAgent: req.headers['user-agent'] || 'Unknown',
    requestId: req.id
  };
  next();
};
