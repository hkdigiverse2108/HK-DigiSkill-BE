const mongoose = require('mongoose');

const courseLessonSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
    title: { type: String },
    subtitle: { type: String },
    priority: { type: Number, default: 0 },
    lessonLock: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const courseLessonModel = mongoose.model('course-lesson', courseLessonSchema);
