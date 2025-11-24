import Joi from "joi";
import { REFERRAL_CODE_STATUS, REFERRAL_REWARD_TYPE } from "../common";

export const addReferralCodeSchema = Joi.object().keys({
    code: Joi.string().required(),
    userId: Joi.string().required(),
    rewardType: Joi.string().valid(...Object.values(REFERRAL_REWARD_TYPE)).required(),
    rewardValue: Joi.number().required(),
    minOrderAmount: Joi.number().default(0),
    maxRewardAmount: Joi.number().optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    usageLimit: Joi.number().allow(null).optional(),
    usedCount: Joi.number().default(0),
    status: Joi.string().valid(...Object.values(REFERRAL_CODE_STATUS)).default(REFERRAL_CODE_STATUS.ACTIVE),
})

export const editReferralCodeSchema = Joi.object().keys({
    referralCodeId: Joi.string().required(),
    code: Joi.string().optional(),
    userId: Joi.string().optional(),
    rewardType: Joi.string().valid(...Object.values(REFERRAL_REWARD_TYPE)).optional(),
    rewardValue: Joi.number().optional(),
    minOrderAmount: Joi.number().optional(),
    maxRewardAmount: Joi.number().optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    usageLimit: Joi.number().allow(null).optional(),
    usedCount: Joi.number().optional(),
    status: Joi.string().valid(...Object.values(REFERRAL_CODE_STATUS)).optional(),
})

export const deleteReferralCodeSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const getReferralCodeSchema = Joi.object().keys({
    id: Joi.string().required(),
})

export const validateReferralCodeSchema = Joi.object().keys({
    code: Joi.string().required(),
    amount: Joi.number().optional(),
})

