const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    images: [{ type: String }],
    title: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const galleryModel = mongoose.model('gallery', gallerySchema);

