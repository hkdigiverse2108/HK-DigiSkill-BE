import { USER_ROLES } from "../../common";

const mongoose = require('mongoose')

const userSchema: any = new mongoose.Schema({
    fullName: { type: String },
    email: { type: String, required: true },
    phoneNumber: { type: String },
    password: { type: String },
    profilePhoto: { type: String, default: null },
    designation: { type: String },
    referralCode: { type: String, default: null },
    agreeTerms: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.USER },
    otp: { type: Number, default: null },
    otpExpireTime: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
    workshopIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'workshop' }],
    courseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'course' }],
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

export const userModel = mongoose.model('user', userSchema);