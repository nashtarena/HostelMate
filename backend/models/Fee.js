const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["Hostel Rent", "Mess Charges", "Electricity", "Other"],
      required: true,
    },
    month: { type: String, required: true }, // e.g. "June 2024"
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },
    paidAt: { type: Date },
    receiptUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);
