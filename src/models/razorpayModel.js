const mongoose = require("mongoose");

const razorpaymentSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    gatewayId: { type: String },
    entity: { type: String },
    amount: { type: Number },
    amountPaid: { type: Number },
    amountDue: { type: Number },
    currency: { type: String },
    attempts: { type: Number },
    receipt: { type: String },
    status: { type: String },
    expiryDate: { type: Date },
    parentSub: { type: mongoose.Schema.Types.ObjectId, ref: "parentSub" },
    category: {
      type: String,
      enum: ["app", "membership"],
    },
  },
  { timestamps: true }
);

const Razorpayment = mongoose.model("Razorpayment", razorpaymentSchema);

module.exports = Razorpayment;
