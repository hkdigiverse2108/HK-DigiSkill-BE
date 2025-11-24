import express from 'express';
import { heroBannerController } from '../controllers';

const router = express.Router();

router.post('/add', heroBannerController.add_hero_banner);
router.post('/edit', heroBannerController.edit_hero_banner_by_id);
router.delete('/delete/:id', heroBannerController.delete_hero_banner_by_id);
router.get('/all', heroBannerController.get_all_hero_banner);
router.get('/:id', heroBannerController.get_hero_banner_by_id);

export const heroBannerRoute = router;

