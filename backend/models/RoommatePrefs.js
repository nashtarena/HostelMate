const mongoose = require("mongoose");

const roommatePrefsSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    sleep: { type: String, enum: ["Early Bird", "Night Owl", "Flexible"], default: "Flexible" },
    study: { type: String, enum: ["Silence Needed", "Noise OK", "Flexible"], default: "Flexible" },
    clean: { type: String, enum: ["Spotless", "Moderate", "Relaxed"], default: "Moderate" },
    guests: { type: String, enum: ["No Guests", "Occasional", "Frequent"], default: "Occasional" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoommatePrefs", roommatePrefsSchema);
