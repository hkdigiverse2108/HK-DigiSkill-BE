import { HERO_BANNER_TYPE } from "../../common";

const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
    type: { type: String, enum: Object.values(HERO_BANNER_TYPE), required: true },
    title: { type: String },
    description: { type: String },
    images: [{ type: String }], // For Web type - 2 images
    link: { type: String }, // For App type
    image: { type: String }, // For App type
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const heroBannerModel = mongoose.model('hero-banner', heroBannerSchema);

