import express from 'express';
import { adminJWT } from '../helper';
import { aboutUsController } from '../controllers';

const router = express.Router();

router.post('/add/edit', adminJWT, aboutUsController.add_edit_about_us)
router.get('/', aboutUsController.get_about_us)

export const aboutUsRouter = router;