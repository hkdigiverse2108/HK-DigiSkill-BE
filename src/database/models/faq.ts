import { FAQ_STATUS } from "../../common";

const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    type: { type: String, enum: Object.values(FAQ_STATUS), default: FAQ_STATUS.HOME },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const faqModel = mongoose.model('faq', faqSchema);

