import express from 'express';
import { courseController, dashboardController } from '../controllers';
import { adminJWT } from '../helper';

const router = express.Router();

router.get('/',  adminJWT, dashboardController.dashboard);

export const dashboardRoute = router;
