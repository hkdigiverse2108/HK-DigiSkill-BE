import express from 'express';
import { userController } from '../controllers';
import { adminJWT } from '../helper';

const router = express.Router();

router.post('/add', adminJWT, userController.add_user);
router.post('/update', adminJWT, userController.edit_user_by_id);
router.delete('/delete/:id', adminJWT, userController.delete_user_by_id);
router.get('/all', adminJWT, userController.get_all_user);
router.get('/:id', adminJWT, userController.get_user_by_id);

export const userRoute = router;

