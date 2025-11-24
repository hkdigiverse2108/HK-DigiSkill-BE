const mongoose = require('mongoose');

const courseCurriculumSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
    courseLessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'course-lesson' },
    date: { type: Date },
    thumbnail: { type: String },
    videoLink: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    attachment: { type: String },
    courseLessonsAssigned: [{ type: mongoose.Schema.Types.ObjectId, ref: 'course-lesson' }],
    courseLessonsPriority: { type: Number, default: 0 },
    curriculumLock: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const courseCurriculumModel = mongoose.model('course-curriculum', courseCurriculumSchema);

