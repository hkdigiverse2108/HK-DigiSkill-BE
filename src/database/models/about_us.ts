const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    aboutUs: { type: String },
    // title: { type: String },
    // description: { type: String },
  },
  { timestamps: true }
);

export const aboutUsModel = mongoose.model("AboutUs", aboutUsSchema);
