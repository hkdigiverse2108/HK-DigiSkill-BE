import { REFERRAL_CODE_STATUS, REFERRAL_REWARD_TYPE } from "../../common";

const mongoose = require('mongoose');

const referralCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    rewardType: { type: String, enum: Object.values(REFERRAL_REWARD_TYPE), required: true },
    rewardValue: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxRewardAmount: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(REFERRAL_CODE_STATUS), default: REFERRAL_CODE_STATUS.ACTIVE },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const referralCodeModel = mongoose.model('referral-code', referralCodeSchema);

