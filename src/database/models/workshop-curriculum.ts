const mongoose = require('mongoose');

const workshopCurriculumSchema = new mongoose.Schema({
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'workshop' },
    date: { type: Date },
    thumbnail: { type: String },
    videoLink: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    priority: { type: Number },
    attachment: { type: String },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const workshopCurriculumModel = mongoose.model('workshop-curriculum', workshopCurriculumSchema);

