import express from 'express';
import { testimonialController } from '../controllers';

const router = express.Router();

router.post('/add', testimonialController.add_testimonial);
router.post('/edit', testimonialController.edit_testimonial_by_id);
router.delete('/delete/:id', testimonialController.delete_testimonial_by_id);
router.get('/all', testimonialController.get_all_testimonial);
router.get('/ratings/summary', testimonialController.get_all_testimonial_rating);
router.get('/:id', testimonialController.get_testimonial_by_id);

export const testimonialRoute = router;

