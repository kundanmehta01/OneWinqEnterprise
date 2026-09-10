import mongoose from 'mongoose';
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
    logger.warn(`Remote MongoDB connection failed (${error.message}). Initializing fallback In-Memory DB...`);

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const memoryUri = memoryServerInstance.getUri();

      const conn = await mongoose.connect(memoryUri, options);
      isConnected = true;
      logger.info(`✅ Connected to In-Memory MongoDB at ${memoryUri}`);

      // Auto-seed in-memory database
      try {
        const { seedPermissions } = await import('../seeds/permissions.seed.js');
        const { seedRoles } = await import('../seeds/roles.seed.js');
        const { seedDepartments } = await import('../seeds/departments.seed.js');
        const { seedTemplates } = await import('../seeds/templates.seed.js');
        const { seedOrganization } = await import('../seeds/organization.seed.js');
        const { seedSuperAdmin } = await import('../seeds/superAdmin.seed.js');
        const { seedSampleMembers } = await import('../seeds/sampleMembers.seed.js');

        await seedPermissions();
        await seedRoles();
        await seedDepartments();
        await seedTemplates();
        await seedOrganization();
        await seedSuperAdmin();
        await seedSampleMembers();
        logger.info('✅ In-Memory database initialized & seeded successfully with OneWinq data!');
      } catch (seedErr) {
        logger.warn(`Auto-seeding warning: ${seedErr.message}`);
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
    await mongoose.connection.close();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
    isConnected = false;
    logger.info('MongoDB connection closed.');
  } catch (error) {
    logger.error(`Error while disconnecting MongoDB: ${error.message}`, { error: error });
  }
};

