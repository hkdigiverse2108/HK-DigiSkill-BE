import Joi from "joi";
import { COUPON_CODE_APPLIES_TO, COUPON_STATUS, DISCOUNT_TYPE } from "../common";

export const addCouponCodeSchema = Joi.object().keys({
    title: Joi.string().required(),
    code: Joi.string().required(),
    discountType: Joi.string().valid(...Object.values(DISCOUNT_TYPE)).required(),
    discountValue: Joi.number().required(),
    minOrderAmount: Joi.number().default(0),
    maxDiscountAmount: Joi.number().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    usageLimit: Joi.number().allow(null).optional(),
    usedCount: Joi.number().default(0),
    appliesTo: Joi.string().valid(...Object.values(COUPON_CODE_APPLIES_TO)).default(COUPON_CODE_APPLIES_TO.DEFAULT),
    specificIds: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid(...Object.values(COUPON_STATUS)).default(COUPON_STATUS.ACTIVE),
})

export const editCouponCodeSchema = Joi.object().keys({
    couponCodeId: Joi.string().required(),
    title: Joi.string().optional(),
    code: Joi.string().optional(),
    discountType: Joi.string().valid(...Object.values(DISCOUNT_TYPE)).optional(),
    discountValue: Joi.number().optional(),
    minOrderAmount: Joi.number().optional(),
    maxDiscountAmount: Joi.number().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    usageLimit: Joi.number().allow(null).optional(),
    usedCount: Joi.number().optional(),
    appliesTo: Joi.string().valid(...Object.values(COUPON_CODE_APPLIES_TO)).optional(),
    specificIds: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid(...Object.values(COUPON_STATUS)).optional(),
})

export const deleteCouponCodeSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getCouponCodeSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const validateCouponCodeSchema = Joi.object().keys({
    code: Joi.string().required(),
    amount: Joi.number().required(),
    appliesToId: Joi.string().optional(),
})

