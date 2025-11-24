import express from 'express';
import { settingsController } from '../controllers';
import { adminJWT } from '../helper';

const router = express.Router();

router.post('/add-edit', adminJWT, settingsController.add_edit_settings);
router.get('/all', settingsController.get_settings);

export const settingsRoute = router;

