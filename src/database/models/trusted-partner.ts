const mongoose = require('mongoose');

const trustedPartnerSchema = new mongoose.Schema({
    image: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const trustedPartnerModel = mongoose.model('trusted-partner', trustedPartnerSchema);

