const mongoose = require("mongoose");

// One document per day
const messMenuSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    dayLabel: { type: String }, // e.g. "Mon"
    breakfast: [String],
    lunch: [String],
    snacks: [String],
    dinner: [String],
  },
  { timestamps: true }
);

const messFeedbackSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    menuDate: { type: Date, required: true },
    meal: { type: String, enum: ["Breakfast", "Lunch", "Snacks", "Dinner"], required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    tags: [String],
    comment: { type: String },
  },
  { timestamps: true }
);

// One feedback per student per meal per day
messFeedbackSchema.index({ student: 1, menuDate: 1, meal: 1 }, { unique: true });

const MessMenu = mongoose.model("MessMenu", messMenuSchema);
const MessFeedback = mongoose.model("MessFeedback", messFeedbackSchema);

module.exports = { MessMenu, MessFeedback };
