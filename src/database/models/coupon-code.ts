import { COUPON_CODE_APPLIES_TO, COUPON_STATUS, DISCOUNT_TYPE } from "../../common";

const mongoose = require('mongoose');

const couponCodeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: Object.values(DISCOUNT_TYPE), required: true },
    discountValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    appliesTo: { type: String, enum: Object.values(COUPON_CODE_APPLIES_TO), default: COUPON_CODE_APPLIES_TO.DEFAULT },
    specificIds: [{ type: mongoose.Schema.Types.ObjectId }],
    status: { type: String, enum: Object.values(COUPON_STATUS), default: COUPON_STATUS.EXPIRED },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const couponCodeModel = mongoose.model('coupon-code', couponCodeSchema);

