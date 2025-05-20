const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    name: { type: String },
    link: { type: String },
  },
  { _id: false }
);

const userSchema = mongoose.Schema(
  {
    name: { type: String },
    uid: { type: String },
    memberId: { type: String },
    bloodgroup: { type: String },
    designation: { type: String, trim: true },
    chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
    image: { type: String },
    email: { type: String },
    phone: { type: String, trim: true },
    secondaryPhone: {
      whatsapp: { type: String },
      business: { type: String },
    },
    bio: { type: String },
    status: {
      type: String,
      enum: [
        "active",
        "inactive",
        "suspended",
        "deleted",
        "blocked",
        "awaiting_payment",
        "trial",
      ],
      default: "awaiting_payment",
    },
    address: { type: String },
    company: [
      {
        name: { type: String, trim: true },
        designation: { type: String, trim: true },
        email: { type: String, trim: true },
        websites: { type: String, trim: true },
        phone: { type: String, trim: true },
        logo: { type: String, trim: true },
      },
    ],
    businessCatogary: { type: String },
    businessSubCatogary: { type: String },
    businessTags: [{ type: String, trim: true, lowercase: true }],
    file: [{ type: String }],
    social: [linkSchema],
    websites: [linkSchema],
    awards: [
      {
        image: { type: String },
        name: { type: String },
        authority: { type: String },
      },
    ],
    videos: [linkSchema],
    certificates: [linkSchema],
    otp: { type: Number },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    subscription: {
      type: String,
      enum: ["free", "premium"],
      default: "premium",
    },
    dateOfJoining: { type: Date },
    fcm: { type: String },
    freeTrialEndDate: { type: Date },
    blueTick: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ name: 1, phone: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;
