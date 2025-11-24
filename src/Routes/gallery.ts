import express from 'express';
import { galleryController } from '../controllers';

const router = express.Router();

router.post('/add', galleryController.add_gallery);
router.post('/edit', galleryController.edit_gallery_by_id);
router.delete('/delete/:id', galleryController.delete_gallery_by_id);
router.get('/all', galleryController.get_all_gallery);
router.get('/:id', galleryController.get_gallery_by_id);

export const galleryRoute = router;

