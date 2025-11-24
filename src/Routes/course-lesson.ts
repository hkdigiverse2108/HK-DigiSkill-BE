import express from 'express';
import { courseLessonController } from '../controllers';
import { adminJWT } from '../helper';

const router = express.Router();

router.post('/add', adminJWT, courseLessonController.add_course_lesson);
router.post('/edit', adminJWT, courseLessonController.edit_course_lesson_by_id);
router.delete('/delete/:id', adminJWT, courseLessonController.delete_course_lesson_by_id);
router.get('/all', courseLessonController.get_all_course_lessons);
router.get('/:id', courseLessonController.get_course_lesson_by_id);

export const courseLessonRoute = router;

