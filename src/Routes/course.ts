import express from 'express';
import { courseController } from '../controllers';
import { adminJWT, userJWT } from '../helper';

const router = express.Router();

router.post('/add', adminJWT, courseController.add_course);
router.post('/update', adminJWT, courseController.edit_course_by_id);
router.delete('/delete/:id', adminJWT, courseController.delete_course_by_id);
router.post('/purchase', userJWT, courseController.purchase_course);
router.get('/my-courses', userJWT, courseController.get_my_courses);
router.get('/all', userJWT, courseController.get_all_course);
router.get('/:id', userJWT, courseController.get_course_by_id);

export const courseRoute = router;

