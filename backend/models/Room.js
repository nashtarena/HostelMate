const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    floor: { type: Number, required: true },
    block: { type: String, required: true },
    type: { type: String, enum: ["Single", "Double", "Triple"], required: true },
    capacity: { type: Number, required: true },
    monthlyRent: { type: Number, default: 4200 },
    amenities: {
      type: [String],
      default: [],
      // e.g. ["WiFi", "Fan", "Attached Bath", "Study Table"]
    },
    status: {
      type: String,
      enum: ["Available", "Full", "Maintenance"],
      default: "Available",
    },
    occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Auto-update status based on occupants vs capacity
roomSchema.pre("save", function (next) {
  if (this.status === "Maintenance") return next();
  this.status = this.occupants.length >= this.capacity ? "Full" : "Available";
  next();
});

module.exports = mongoose.model("Room", roomSchema);
