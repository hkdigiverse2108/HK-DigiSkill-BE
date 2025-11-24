import express from 'express';
import { courseCategoryController } from '../controllers';
import { adminJWT } from '../helper';

const router = express.Router();

router.post('/add', adminJWT, courseCategoryController.add_course_category);
router.post('/edit', adminJWT, courseCategoryController.edit_course_category_by_id);
router.delete('/delete/:id', adminJWT, courseCategoryController.delete_course_category_by_id);
router.get('/all', courseCategoryController.get_all_course_category);
router.get('/:id', courseCategoryController.get_course_category_by_id);

export const courseCategoryRoute = router;

