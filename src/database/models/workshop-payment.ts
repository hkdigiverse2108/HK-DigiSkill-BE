import { PAYMENT_STATUS } from "../../common";

const mongoose = require('mongoose');

const workshopPaymentSchema = new mongoose.Schema({
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'workshop' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    amount: { type: Number },
    paymentStatus: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING },
    paymentMethod: { type: String },
    paymentId: { type: String },
    transactionDate: { type: Date },
    receiptNumber: { type: String },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const workshopPaymentModel = mongoose.model('workshop-payment', workshopPaymentSchema);
