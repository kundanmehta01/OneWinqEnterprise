import request from 'supertest';
import { createApp } from '../src/app.js';
import { User } from '../src/modules/users/user.model.js';
import { TeamMember } from '../src/modules/team-members/teamMember.model.js';
import { Role } from '../src/modules/roles/role.model.js';
import { hashPassword } from '../src/utils/hash.util.js';
import { SYSTEM_ROLES } from '../src/constants/roles.constant.js';

describe('Authentication & Security Tests', () => {
  let app;
  const testEmail = 'auth.test@onewinq.com';
  const testPassword = 'Password@12345';

  beforeAll(async () => {
    app = createApp();

    const role = await Role.findOne({ name: SYSTEM_ROLES.EMPLOYEE });
    const passwordHash = await hashPassword(testPassword);

    const user = await User.create({
      email: testEmail,
      passwordHash,
      status: 'active',
      emailVerified: true
    });

    await TeamMember.create({
      userId: user._id,
      employeeId: 'TEST-001',
      name: 'Auth Test User',
      designation: 'Software Tester',
      roleId: role._id,
      status: 'active'
    });
  });

  it('POST /api/v1/auth/login - should authenticate successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.email).toBe(testEmail);
  });

  it('POST /api/v1/auth/login - should reject invalid password with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: 'WrongPassword123' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('POST /api/v1/auth/refresh-token - should rotate refresh tokens correctly', async () => {
    // 1. Login to get initial refresh token
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testEmail, password: testPassword });

    const initialRefreshToken = loginRes.body.data.refreshToken;

    // 2. Refresh token
    const refreshRes = await request(app)
      .post('/api/v1/auth/refresh-token')
      .send({ refreshToken: initialRefreshToken });

    expect(refreshRes.status).toBe(200);
    expect(refreshRes.body.success).toBe(true);
    expect(refreshRes.body.data.accessToken).toBeDefined();
    expect(refreshRes.body.data.refreshToken).toBeDefined();
    expect(refreshRes.body.data.refreshToken).not.toBe(initialRefreshToken);

    // 3. Attempting to reuse old refresh token should trigger reuse detection and return 401
    const reuseRes = await request(app)
      .post('/api/v1/auth/refresh-token')
      .send({ refreshToken: initialRefreshToken });

    expect(reuseRes.status).toBe(401);
    expect(reuseRes.body.error.code).toBe('TOKEN_REUSE_DETECTED');
  });

  it('POST /api/v1/auth/forgot-password - should process forgot password request safely', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: testEmail });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
