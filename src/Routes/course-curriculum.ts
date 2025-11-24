import express from 'express';
import { courseCurriculumController } from '../controllers';
import { adminJWT } from '../helper';

const router = express.Router();

router.post('/add', adminJWT, courseCurriculumController.add_course_curriculum);
router.post('/edit', adminJWT, courseCurriculumController.edit_course_curriculum_by_id);
router.delete('/delete/:id', adminJWT, courseCurriculumController.delete_course_curriculum_by_id);
router.get('/all', courseCurriculumController.get_all_course_curriculums);
router.get('/:id', courseCurriculumController.get_course_curriculum_by_id);

export const courseCurriculumRoute = router;

