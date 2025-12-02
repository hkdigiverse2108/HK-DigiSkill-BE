const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
} , { timestamps: true, versionKey: false });

export const contactUsModel = mongoose.model('contact-us', contactUsSchema);