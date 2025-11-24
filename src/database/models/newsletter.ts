const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    dateTime: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const newsletterModel = mongoose.model('newsletter', newsletterSchema);

