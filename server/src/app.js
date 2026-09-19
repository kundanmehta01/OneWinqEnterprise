import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env.config.js';
import { logger } from './config/logger.config.js';
import { swaggerSpec } from './config/swagger.config.js';
import { v1Routes } from './routes/index.js';
import { requestIdMiddleware } from './middlewares/requestId.middleware.js';
import { auditContextMiddleware } from './middlewares/audit.middleware.js';
import { standardRateLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware.js';

export const createApp = () => {
  const app = express();

  // 1. Trust proxy for rate limiting / IP detection
  app.set('trust proxy', 1);

  // 2. Security headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    })
  );

  // 3. CORS configuration
  const rawOrigins = (env.FRONTEND_URL || 'http://localhost:3000').split(',').map((u) => u.trim().replace(/\/+$/, ''));
  const allowedOrigins = Array.from(new Set([...rawOrigins, 'http://localhost:3000']));
  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, '').toLowerCase();
      if (
        allowedOrigins.some((o) => o.toLowerCase() === normalizedOrigin) ||
        normalizedOrigin.endsWith('.vercel.app') ||
        normalizedOrigin.includes('localhost') ||
        normalizedOrigin.includes('127.0.0.1') ||
        env.NODE_ENV === 'development'
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'Accept', 'Origin', 'X-Requested-With']
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  // 4. Response compression
  app.use(compression());

  // 5. Request correlation ID & Audit context
  app.use(requestIdMiddleware);
  app.use(auditContextMiddleware);

  // 6. Global rate limiting
  app.use(standardRateLimiter);

  // 7. Body parsers
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // 8. Morgan HTTP Request Logger
  if (env.NODE_ENV !== 'test') {
    const morganStream = {
      write: (message) => logger.http(message.trim())
    };
    app.use(
      morgan(
        ':remote-addr - :method :url :status :res[content-length] - :response-time ms [req-id: :req[x-request-id]]',
        { stream: morganStream }
      )
    );
  }

  // 9. Static uploads directory serving (local only)
  if (!process.env.VERCEL) {
    const uploadsDir = path.resolve(process.cwd(), env.STORAGE_LOCAL_UPLOAD_DIR);
    app.use('/uploads', express.static(uploadsDir));
  }

  // 10. Swagger / OpenAPI Documentation
  if (!process.env.VERCEL) {
    import('swagger-ui-express')
      .then((mod) => {
        const swaggerUi = mod.default || mod;
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
      })
      .catch(() => {});
  } else {
    app.get('/api-docs', (req, res) => {
      res.json({ message: 'Swagger UI is disabled on serverless runtime. Access /api-docs.json for OpenAPI spec.' });
    });
  }
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Immediate health check and favicon (zero DB dependencies)
  app.get('/favicon.ico', (req, res) => res.status(204).end());
  app.get('/health', (req, res) => res.status(200).json({ status: 'ok', app: 'OneWinq Backend' }));
  app.get('/api/v1/health', (req, res) => res.status(200).json({ status: 'ok', app: 'OneWinq Backend' }));

  // Auto-connect to DB in serverless environments (e.g. Vercel) for data routes
  let isDbConnected = false;
  app.use('/api/v1', async (req, res, next) => {
    if (req.path === '/health') return next();
    if (process.env.VERCEL && !isDbConnected) {
      try {
        const { connectDB } = await import('./config/db.config.js');
        await connectDB();
        isDbConnected = true;
      } catch (err) {
        logger.warn(`Serverless DB connection warning: ${err.message}`);
      }
    }
    next();
  });

  // 11. API Routes
  app.use('/api/v1', v1Routes);

  // 12. 404 & Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

// Default export for Vercel serverless compatibility.
// Vercel validates that every JS module in the deployment has a default export
// that is a function or http.Server. Without this, it throws:
// "Invalid export found in module ... The default export must be a function or server."
export default createApp();
