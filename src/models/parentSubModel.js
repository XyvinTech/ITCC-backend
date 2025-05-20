const mongoose = require("mongoose");

const parentSubSchema = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    days: { type: Number },
    price: { type: Number },
  },
  { timestamps: true }
);

const ParentSub = mongoose.model("parentSub", parentSubSchema);

module.exports = ParentSub;
