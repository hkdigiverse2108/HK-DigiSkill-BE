const mongoose = require('mongoose');

const userAccountDeletionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    reason: { type: String, required: true },
    rate: { type: Number, required: true, min: 1, max: 10 },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const userAccountDeletionModel = mongoose.model('user-account-deletion', userAccountDeletionSchema);

