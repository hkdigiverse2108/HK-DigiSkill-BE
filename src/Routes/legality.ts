import express from 'express';
import { legalityController } from '../controllers';
import { adminJWT } from '../helper';

const router = express.Router();

router.post('/add', adminJWT, legalityController.add_legality);
router.get('/', legalityController.get_legality);

export const legalityRoute = router;

