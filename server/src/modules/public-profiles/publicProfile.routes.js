import { Router } from 'express';
import { publicProfileController } from './publicProfile.controller.js';

const router = Router();

// Public company profile
router.get('/company', publicProfileController.getCompanyProfile.bind(publicProfileController));

// Public employee profiles by slug
router.get('/profiles/:slug', publicProfileController.getEmployeeProfile.bind(publicProfileController));
router.get('/profiles/:slug/qr', publicProfileController.getProfileQrCode.bind(publicProfileController));

// Public smart / NFC card tap resolver
router.get('/cards/:cardUid', publicProfileController.resolveCardTap.bind(publicProfileController));
router.get('/c/:cardUid', publicProfileController.resolveCardTap.bind(publicProfileController));

// Public telemetry interaction event tracking
router.post('/events', publicProfileController.recordPublicEvent.bind(publicProfileController));

export const publicProfileRoutes = router;
