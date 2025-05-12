const e = require("express");
const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema(
  {
    type: { type: String,enum: ["image", "video"] },
    url: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
);
const folderSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    files: [fileSchema],
  },
  { timestamps: true }
);
const Folder = mongoose.model("Folder", folderSchema);
module.exports = Folder;
