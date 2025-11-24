const mongoose = require('mongoose');

const getInTouchSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    subject: { type: String },
    message: { type: String },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const getInTouchModel = mongoose.model('get-in-touch', getInTouchSchema);

