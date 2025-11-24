import { LEGALITY_TYPE } from "../../common";

const mongoose = require('mongoose');

const legalitySchema = new mongoose.Schema({
    type: { type: String, enum: Object.values(LEGALITY_TYPE), required: true, unique: true },
    content: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const legalityModel = mongoose.model('legality', legalitySchema);

