import { Router } from 'express';
import { userDashboardController } from './userDashboard.controller.js';
import { authenticate } from '../../middlewares/authenticate.middleware.js';

const router = Router();

router.use(authenticate);

// Personalized employee home
router.get('/', userDashboardController.getDashboard.bind(userDashboardController));

export const userDashboardRoutes = router;
