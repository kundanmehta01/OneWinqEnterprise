import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { initializeEventListeners } from '../src/events/listeners/index.js';
import { seedPermissions } from '../src/seeds/permissions.seed.js';
import { seedRoles } from '../src/seeds/roles.seed.js';
import { seedTemplates } from '../src/seeds/templates.seed.js';
import { seedOrganization } from '../src/seeds/organization.seed.js';

let mongoServer;

beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test_access_secret_32_chars_long_key_1234';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_32_chars_long_key_1234';
  process.env.EMAIL_PROVIDER = 'mock';
  process.env.STORAGE_PROVIDER = 'local';
  process.env.AUTH_RATE_LIMIT_MAX_REQUESTS = '100';

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  initializeEventListeners();

  // Seed baseline system configuration
  await seedPermissions();
  await seedRoles();
  await seedTemplates();
  await seedOrganization();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
