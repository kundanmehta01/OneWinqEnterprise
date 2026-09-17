import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

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
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        env.NODE_ENV === 'development'
      ) {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked by origin policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id']
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

  // 9. Static uploads directory serving
  const uploadsDir = path.resolve(process.cwd(), env.STORAGE_LOCAL_UPLOAD_DIR);
  app.use('/uploads', express.static(uploadsDir));

  // 10. Swagger / OpenAPI Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
