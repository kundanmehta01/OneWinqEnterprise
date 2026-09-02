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
  const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'];
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin || allowedOrigins.includes(origin) || env.NODE_ENV === 'development') {
          return callback(null, true);
        }
        return callback(new Error('CORS blocked by origin policy'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id']
    })
  );

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

  // 11. API Routes
  app.use('/api/v1', v1Routes);

  // 12. 404 & Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
