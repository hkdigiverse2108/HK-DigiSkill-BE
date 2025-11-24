const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    courseCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'course-category' },
    description: { type: String },
    price: { type: Number, default: 0 },
    image: { type: String },
    purchasedCoursesShow: { type: Boolean, default: false },
    enrolledLearners: { type: Number, default: 0 },
    classCompleted: { type: Number, default: 0 },
    satisfactionRate: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const courseModel = mongoose.model('course', courseSchema);

