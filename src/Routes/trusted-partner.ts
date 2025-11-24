import express from 'express';
import { trustedPartnerController } from '../controllers';

const router = express.Router();

router.post('/add', trustedPartnerController.add_trusted_partner);
router.post('/edit', trustedPartnerController.edit_trusted_partner_by_id);
router.delete('/delete/:id', trustedPartnerController.delete_trusted_partner_by_id);
router.get('/all', trustedPartnerController.get_all_trusted_partner);
router.get('/:id', trustedPartnerController.get_trusted_partner_by_id);

export const trustedPartnerRoute = router;

