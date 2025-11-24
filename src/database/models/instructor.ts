const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    image: { type: String },
    name: { type: String, required: true },
    designation: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const instructorModel = mongoose.model('instructor', instructorSchema);

