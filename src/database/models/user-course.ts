import { PAYMENT_STATUS } from "../../common";

const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
    purchaseDate: { type: Date, default: Date.now },
    paymentStatus: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const userCourseModel = mongoose.model('user_course', userCourseSchema);

