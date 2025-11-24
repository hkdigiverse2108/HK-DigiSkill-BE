import express from 'express';
import { getInTouchController } from '../controllers';

const router = express.Router();

router.post('/add', getInTouchController.add_get_in_touch);
router.post('/edit', getInTouchController.edit_get_in_touch_by_id);
router.delete('/delete/:id', getInTouchController.delete_get_in_touch_by_id);
router.get('/all', getInTouchController.get_all_get_in_touch);
router.get('/:id', getInTouchController.get_get_in_touch_by_id);

export const getInTouchRoute = router;

