import { TESTIMONIAL_TYPE } from "../../common";

const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    image: { type: String },
    name: { type: String, required: true },
    designation: { type: String },
    rate: { type: Number, min: 0, max: 5 },
    description: { type: String },
    learningCatalogId: { type: mongoose.Schema.Types.ObjectId, refPath: "type" },
    isFeatured: { type: Boolean, default: false },
    type: { type: String, enum: Object.values(TESTIMONIAL_TYPE), default: TESTIMONIAL_TYPE.HOME },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const testimonialModel = mongoose.model('testimonial', testimonialSchema);

