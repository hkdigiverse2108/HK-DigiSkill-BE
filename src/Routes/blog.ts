import express from 'express';
import { blogController } from '../controllers';

const router = express.Router();

router.post('/add', blogController.add_blog);
router.post('/edit', blogController.edit_blog_by_id);
router.delete('/delete/:id', blogController.delete_blog_by_id);
router.get('/all', blogController.get_all_blog);
router.get('/:id', blogController.get_blog_by_id);

export const blogRoute = router;
