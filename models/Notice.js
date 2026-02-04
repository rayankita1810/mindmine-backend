const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true } // store image path
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
