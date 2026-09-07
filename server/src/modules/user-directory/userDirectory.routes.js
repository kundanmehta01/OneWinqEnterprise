import { Router } from 'express';
import { userDirectoryController } from './userDirectory.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';

const router = Router();

router.use(authenticate);

// 1. Department Explorer
router.get('/departments', userDirectoryController.getDepartments.bind(userDirectoryController));
router.get('/departments/:id', userDirectoryController.getDepartmentById.bind(userDirectoryController));

// 2. Team Member Directory
router.get('/team', userDirectoryController.getTeamDirectory.bind(userDirectoryController));

// 3. Company Identity Overview
router.get('/company', userDirectoryController.getCompanyOverview.bind(userDirectoryController));

export const userDirectoryRoutes = router;
