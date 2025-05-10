const { required } = require("joi");
const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema(
  {
    type: { type: String },
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
