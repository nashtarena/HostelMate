const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["student", "warden", "admin"], default: "student" },
    rollNumber: { type: String, unique: true, sparse: true },
    course: { type: String },
    year: { type: Number, min: 1, max: 4 },
    phone: { type: String },
    parentPhone: { type: String },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    block: { type: String },
    profileInitials: { type: String },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", userSchema);
