import express from 'express';
import { instructorController } from '../controllers';
import { adminJWT } from '../helper';

const router = express.Router();

router.post('/add', adminJWT, instructorController.add_instructor);
router.post('/edit', adminJWT, instructorController.edit_instructor_by_id);
router.delete('/delete/:id', adminJWT, instructorController.delete_instructor_by_id);
router.get('/all', instructorController.get_all_instructors);
router.get('/:id', instructorController.get_instructor_by_id);

export const instructorRoute = router;

