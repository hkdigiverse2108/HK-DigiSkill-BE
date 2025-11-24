const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    logo: { type: String },
    razorpayKey: { type: String },
    razorpaySecret: { type: String },
    enrolledLearners: { type: Number, default: 0 },
    classCompleted: { type: Number, default: 0 },
    satisfactionRate: { type: Number, default: 0 },
    link: { type: String, default: null },
    address: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    email: { type: String, default: null },
    socialMediaLinks: {
        facebook: { type: String, default: null },
        twitter: { type: String, default: null },
        instagram: { type: String, default: null },
        linkedin: { type: String, default: null },
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const settingsModel = mongoose.model('settings', settingsSchema);

