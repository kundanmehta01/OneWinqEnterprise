import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { env } from './env.config.js';
import { logger } from './logger.config.js';

let isConnected = false;
let memoryServerInstance = null;

export const connectDB = async (uri = env.MONGODB_URI) => {
  if (isConnected) {
    return mongoose.connection;
  }

  const options = {
    autoIndex: env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 4000,
    socketTimeoutMS: 45000
  };

  try {
    if (env.MONGODB_DEBUG) {
      mongoose.set('debug', (collectionName, method, query, doc) => {
        logger.debug(`Mongoose: ${collectionName}.${method}`, { query, doc });
      });
    }

    const conn = await mongoose.connect(uri, options);
    isConnected = true;
    logger.info(`MongoDB connected successfully to ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`, { error: err });
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('MongoDB disconnected. Attempting reconnection...');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      logger.info('MongoDB reconnected successfully.');
    });

    return conn;
  } catch (error) {
    logger.warn(`Remote MongoDB connection failed (${error.message}). Initializing persistent Local DB...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const localDbDir = path.resolve(process.cwd(), 'data', 'db');
      if (!fs.existsSync(localDbDir)) {
        fs.mkdirSync(localDbDir, { recursive: true });
      }

      // Check and cleanup stale mongod.lock file if present
      const lockFile = path.join(localDbDir, 'mongod.lock');
      if (fs.existsSync(lockFile)) {
        try {
          fs.unlinkSync(lockFile);
          logger.info('🧹 Cleaned up stale mongod.lock before starting local DB.');
        } catch (_) {
          try {
            const { execSync } = await import('child_process');
            if (process.platform === 'win32') {
              execSync('taskkill /F /IM mongod* 2>nul || exit 0', { shell: 'cmd.exe' });
            } else {
              execSync('pkill -9 mongod || true');
            }
            if (fs.existsSync(lockFile)) {
              fs.unlinkSync(lockFile);
            }
            logger.info('🧹 Released lingering mongod process and cleared lock.');
          } catch (cleanErr) {
            logger.warn(`Could not clear lock file: ${cleanErr.message}`);
          }
        }
      }

      memoryServerInstance = await MongoMemoryServer.create({
        instance: {
          dbPath: localDbDir,
          storageEngine: 'wiredTiger',
          dbName: 'onewinq'
        }
      });
      const memoryUri = memoryServerInstance.getUri('onewinq');

      const conn = await mongoose.connect(memoryUri, options);
      isConnected = true;
      logger.info(`✅ Connected to Persistent Local MongoDB at ${memoryUri} (Data Directory: ${localDbDir})`);

      // Ensure nodemon graceful restart handler
      process.once('SIGUSR2', async () => {
        await disconnectDB();
        process.kill(process.pid, 'SIGUSR2');
      });

      // Check if DB already has users/data before running seeds
      try {
        const { User } = await import('../modules/users/user.model.js');
        const existingUserCount = await User.countDocuments();

        if (existingUserCount === 0) {
          logger.info('🌱 Empty database detected. Seeding initial OneWinq data...');
          const { seedPermissions } = await import('../seeds/permissions.seed.js');
          const { seedRoles } = await import('../seeds/roles.seed.js');
          const { seedDepartments } = await import('../seeds/departments.seed.js');
          const { seedTemplates } = await import('../seeds/templates.seed.js');
          const { seedOrganization } = await import('../seeds/organization.seed.js');
          const { seedSuperAdmin } = await import('../seeds/superAdmin.seed.js');
          const { seedSampleMembers } = await import('../seeds/sampleMembers.seed.js');

          await seedPermissions();
          await seedRoles();
          await seedTemplates();
          await seedDepartments();
          await seedOrganization();
          await seedSuperAdmin();
          await seedSampleMembers();
          logger.info('✅ Initial OneWinq data seeded successfully!');
        } else {
          logger.info(`💾 Existing database with ${existingUserCount} users loaded. Preserving all existing users and organization data across restarts.`);
          try {
            const { enrichAllProfiles } = await import('../seeds/enrichProfiles.js');
            // Auto-enrich all employee profiles with full 8-section dynamic identity flow
            enrichAllProfiles().catch((err) => {
              logger.error('Error auto-enriching employee profiles:', err.message);
            });
          } catch (enrichErr) {
            logger.warn(`Profile enrichment note: ${enrichErr.message}`);
          }
        }
      } catch (seedErr) {
        logger.warn(`Database check/seeding warning: ${seedErr.message}`);
      }

      return conn;
    } catch (fallbackError) {
      logger.error(`Failed to connect to MongoDB fallback: ${fallbackError.message}`, { error: fallbackError });
      if (env.NODE_ENV !== 'test') {
        process.exit(1);
      }
      throw error;
    }
  }
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  try {
    if (mongoose.connection.readyState !== 0) {
      if (memoryServerInstance) {
        try {
          // Flush WiredTiger storage to disk before shutting down
          await mongoose.connection.db.admin().command({ fsync: 1 });
          await mongoose.connection.db.admin().command({ shutdown: 1 });
        } catch (_) {
          // Expected when server disconnects on shutdown command
        }
      }
      await mongoose.connection.close();
    }
    if (memoryServerInstance) {
      await memoryServerInstance.stop({ doCleanup: false });
      memoryServerInstance = null;
    }
    isConnected = false;
    logger.info('MongoDB connection closed.');
  } catch (error) {
    logger.error(`Error while disconnecting MongoDB: ${error.message}`, { error: error });
  }
};

