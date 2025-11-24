const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
    image: { type: String },
    title: { type: String, required: true },
    subTitle: { type: String },
    about: { type: String },
    pdfAttach: { type: String },
    workshopCurriculum: [{ type: mongoose.Schema.Types.ObjectId, ref: 'workshop-curriculum' }],
    workshopTestimonials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'testimonial' }],
    workshopFAQ: [{ type: mongoose.Schema.Types.ObjectId, ref: 'faq' }],
    price: { type: Number, default: 0 },
    mrpPrice: { type: Number, default: 0 },
    validFor: { type: String }, // e.g., "30 days", "1 year"
    couponCode: { type: String },
    language: { type: String },
    duration: { type: String },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const workshopModel = mongoose.model('workshop', workshopSchema);

