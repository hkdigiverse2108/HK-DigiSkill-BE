import express from 'express';
import { couponCodeController } from '../controllers';
import { adminJWT, userJWT } from '../helper';

const router = express.Router();

router.post('/add', adminJWT, couponCodeController.add_coupon_code);
router.post('/edit', adminJWT, couponCodeController.edit_coupon_code_by_id);
router.delete('/delete/:id', adminJWT, couponCodeController.delete_coupon_code_by_id);
router.get('/all', adminJWT, couponCodeController.get_all_coupon_codes);
router.get('/:id', adminJWT, couponCodeController.get_coupon_code_by_id);
router.post('/validate', userJWT, couponCodeController.validate_coupon_code);

export const couponCodeRoute = router;

