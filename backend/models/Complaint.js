const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      enum: ["Electrical", "Plumbing", "Maintenance", "Cleanliness", "Other"],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["Urgent", "High", "Medium", "Low"], default: "Medium" },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
