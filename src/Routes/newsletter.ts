import express from 'express';
import { newsletterController } from '../controllers';

const router = express.Router();

router.post('/add', newsletterController.add_newsletter);
router.post('/send', newsletterController.send_newsletter_to_subscribers);
router.delete('/delete/:id', newsletterController.delete_newsletter_by_id);
router.get('/all', newsletterController.get_all_newsletter);
router.get('/:id', newsletterController.get_newsletter_by_id);

export const newsletterRoute = router;

