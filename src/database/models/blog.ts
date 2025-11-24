const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String },
    subTitle: { type: String, default: null },
    content: { type: String },
    category: { type: String },
    coverImage: { type: String },
    mainImage: { type: String },
    author: { type: String },
    quote: { type: String },
    isFeatured: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
} , { timestamps: true, versionKey: false });

export const blogModel = mongoose.model('blog', blogSchema);