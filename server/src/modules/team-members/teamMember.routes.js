import { Router } from 'express';
import { teamMemberController } from './teamMember.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';
import { requirePermission } from '../../middlewares/authorize.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  teamMemberIdParamSchema
} from './teamMember.validation.js';
import { PERMISSIONS } from '../../constants/permissions.constant.js';

const router = Router();

router.use(authenticate);

router.get(
  '/',
  requirePermission(PERMISSIONS.TEAM_READ),
  teamMemberController.getAllTeamMembers.bind(teamMemberController)
);

// Dedicated route to view past / deleted members (MUST be before /:id)
router.get(
  '/deleted',
  requirePermission(PERMISSIONS.TEAM_READ),
  teamMemberController.getDeletedTeamMembers.bind(teamMemberController)
);

router.get(
  '/past',
  requirePermission(PERMISSIONS.TEAM_READ),
  teamMemberController.getDeletedTeamMembers.bind(teamMemberController)
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.TEAM_READ),
  validate({ params: teamMemberIdParamSchema }),
  teamMemberController.getTeamMemberById.bind(teamMemberController)
);

router.post(
  '/',
  requirePermission(PERMISSIONS.TEAM_CREATE),
  validate({ body: createTeamMemberSchema }),
  teamMemberController.createTeamMember.bind(teamMemberController)
);

router.patch(
  '/:id',
  requirePermission(PERMISSIONS.TEAM_UPDATE),
  validate({ params: teamMemberIdParamSchema, body: updateTeamMemberSchema }),
  teamMemberController.updateTeamMember.bind(teamMemberController)
);

router.delete(
  '/:id',
  requirePermission(PERMISSIONS.TEAM_DELETE),
  validate({ params: teamMemberIdParamSchema }),
  teamMemberController.deleteTeamMember.bind(teamMemberController)
);

router.post(
  '/:id/restore',
  requirePermission(PERMISSIONS.TEAM_UPDATE),
  validate({ params: teamMemberIdParamSchema }),
  teamMemberController.restoreTeamMember.bind(teamMemberController)
);

export const teamMemberRoutes = router;
