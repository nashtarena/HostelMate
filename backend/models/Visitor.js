const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relation: {
      type: String,
      enum: ["Parent", "Sibling", "Friend", "Guardian", "Other"],
      required: true,
    },
    purpose: { type: String },
    scheduledAt: { type: Date, required: true },
    status: { type: String, enum: ["Expected", "Checked In", "Checked Out"], default: "Expected" },
    checkedInAt: { type: Date },
    checkedOutAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
