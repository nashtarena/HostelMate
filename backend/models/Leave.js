const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    destination: { type: String, required: true },
    reason: { type: String, required: true },
    parentContact: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    qrCode: { type: String }, // base64 data URL generated on approval
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
