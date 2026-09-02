import http from 'http';
import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.config.js';
import { env } from './config/env.config.js';
import { logger } from './config/logger.config.js';
import { initializeEventListeners } from './events/listeners/index.js';

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Initialize Internal Event Listeners
    initializeEventListeners();

    // 3. Create Express App
    const app = createApp();
    const server = http.createServer(app);

    // 4. Start Server Listener
    server.listen(env.PORT, () => {
      logger.info(`========================================================`);
      logger.info(`🚀 OneWinq Backend Server running in [${env.NODE_ENV}] mode`);
      logger.info(`📡 Listening on: ${env.APP_URL}`);
      logger.info(`📚 Swagger API Docs: ${env.APP_URL}/api-docs`);
      logger.info(`💖 Health Check: ${env.APP_URL}/api/v1/health`);
      logger.info(`========================================================`);
    });

    // 5. Graceful Shutdown Handlers
    const gracefulShutdown = async (signal) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDB();
        logger.info('Database connection closed. Exiting process.');
        process.exit(0);
      });

      // Force shutdown after 10s if graceful fails
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Promise Rejection:', { reason, promise });
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', { error: error.stack || error.message });
      process.exit(1);
    });
  } catch (error) {
    logger.error(`Server initialization failed: ${error.message}`, { error });
    process.exit(1);
  }
};

startServer();
