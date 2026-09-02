import { verifyAccessToken } from '../utils/token.util.js';
import { User } from '../modules/users/user.model.js';
import { TeamMember } from '../modules/team-members/teamMember.model.js';
import { Role } from '../modules/roles/role.model.js';
import { UnauthorizedError, ForbiddenError } from '../errors/index.js';
import { ERROR_CODES } from '../constants/errorCodes.constant.js';
import { SYSTEM_ROLES } from '../constants/roles.constant.js';
import { ALL_PERMISSIONS } from '../constants/permissions.constant.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // 2. Check Cookie fallback
    if (!token && req.cookies) {
      token = req.cookies.access_token || req.cookies.token;
    }

    if (!token) {
      throw new UnauthorizedError('Authentication token is missing', ERROR_CODES.UNAUTHORIZED);
    }

    // 3. Verify Token
    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.userId) {
      throw new UnauthorizedError('Invalid or expired authentication token', ERROR_CODES.INVALID_TOKEN);
    }

    // 4. Fetch User
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError('User account associated with token no longer exists', ERROR_CODES.UNAUTHORIZED);
    }

    // 5. Check User Status
    if (user.status === 'suspended') {
      throw new ForbiddenError('Account is suspended. Please contact your organization administrator.', ERROR_CODES.ACCOUNT_SUSPENDED);
    }

    if (user.status === 'inactive') {
      throw new ForbiddenError('Account is inactive.', ERROR_CODES.ACCOUNT_INACTIVE);
    }

    if (user.isLocked()) {
      throw new ForbiddenError('Account is temporarily locked due to repeated failed logins.', ERROR_CODES.ACCOUNT_LOCKED);
    }

    // 6. Fetch TeamMember and Role details
    const member = await TeamMember.findOne({ userId: user._id, status: { $ne: 'archived' } })
      .populate('roleId')
      .populate('departmentId');

    let permissions = [];
    let roleName = 'User';
    let isSuperAdmin = false;

    if (member && member.roleId) {
      roleName = member.roleId.name;
      if (member.roleId.name === SYSTEM_ROLES.SUPER_ADMIN) {
        isSuperAdmin = true;
        permissions = ALL_PERMISSIONS;
      } else {
        permissions = member.roleId.permissions || [];
      }
    }

    // Attach to request
    req.user = user;
    req.member = member || null;
    req.roleName = roleName;
    req.isSuperAdmin = isSuperAdmin;
    req.permissions = permissions;

    return next();
  } catch (error) {
    next(error);
  }
};
