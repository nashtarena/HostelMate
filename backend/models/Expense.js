const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Food", "Cleaning", "Utilities", "Transport", "Other"],
      required: true,
    },
    amount: { type: Number, required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    splitAmong: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // Tracks who has settled their share
    settled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
