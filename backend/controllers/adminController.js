const crypto = require("crypto");
const User = require("../models/User");
const Room = require("../models/Room");
const Complaint = require("../models/Complaint");
const Leave = require("../models/Leave");
const Fee = require("../models/Fee");
const { MessFeedback } = require("../models/Mess");

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Generate a random readable password like  Hs8$kLm2 */
function generatePassword(length = 10) {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$";
  return Array.from(crypto.randomFillSync(new Uint8Array(length)))
    .map((b) => chars[b % chars.length])
    .join("");
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────

// GET /api/admin/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalStudents, rooms, openComplaints, pendingLeaves, fees, recentFeedback] =
      await Promise.all([
        User.countDocuments({ role: "student" }),
        Room.find(),
        Complaint.countDocuments({ status: { $in: ["Open", "In Progress"] } }),
        Leave.countDocuments({ status: "Pending" }),
        Fee.find(),
        MessFeedback.find({ menuDate: { $gte: new Date(Date.now() - 7 * 86400000) } }),
      ]);

    const occupied = rooms.filter((r) => r.status === "Full").length;
    const totalRooms = rooms.length;
    const feesTotal = fees.reduce((s, f) => s + f.amount, 0);
    const feesCollected = fees.filter((f) => f.status === "Paid").reduce((s, f) => s + f.amount, 0);
    const collectionRate = feesTotal ? Math.round((feesCollected / feesTotal) * 100) : 0;
    const avgMessRating = recentFeedback.length
      ? (recentFeedback.reduce((s, f) => s + f.rating, 0) / recentFeedback.length).toFixed(1)
      : null;

    const since = new Date(Date.now() - 12 * 86400000);
    const trend = await Complaint.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { day: { $dateToString: { format: "%b %d", date: "$createdAt" } }, cat: "$category" }, count: { $sum: 1 } } },
      { $sort: { "_id.day": 1 } },
    ]);

    res.json({
      totalStudents,
      roomsOccupied: `${occupied}/${totalRooms}`,
      occupancyPct: totalRooms ? Math.round((occupied / totalRooms) * 100) : 0,
      openComplaints,
      pendingLeaves,
      feesThisMonth: feesCollected,
      collectionRate,
      avgMessRating,
      complaintTrend: trend,
      rooms,
    });
  } catch (err) {
    next(err);
  }
};

// ── Student Management ────────────────────────────────────────────────────────

// GET /api/admin/students
exports.getStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" })
      .populate("room", "number block floor")
      .populate("parent", "name email phone")
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, students });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/students  — warden creates a student account
exports.createStudent = async (req, res, next) => {
  try {
    const {
      name, email, rollNumber, course, year, phone,
      address, dateOfBirth, emergencyContact, block, room,
    } = req.body;

    if (!name || !email || !rollNumber)
      return res.status(400).json({ success: false, message: "name, email, rollNumber required" });

    const plainPassword = generatePassword();

    const student = await User.create({
      name,
      email,
      password: plainPassword,      // will be hashed by pre-save hook
      role: "student",
      rollNumber,
      course,
      year,
      phone,
      address,
      dateOfBirth,
      emergencyContact,
      block,
      room: room || undefined,
      profileInitials: name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
      mustChangePassword: true,
    });

    res.status(201).json({
      success: true,
      message: "Student account created",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
      },
      // Return plaintext password ONCE so warden can hand it to the student
      generatedPassword: plainPassword,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/students/:id  — update student info
exports.updateStudent = async (req, res, next) => {
  try {
    const allowed = ["name", "email", "rollNumber", "course", "year", "phone",
      "address", "dateOfBirth", "emergencyContact", "block", "room"];
    const update = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: "student" },
      update,
      { new: true, runValidators: true }
    ).select("-password");

    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, student });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/students/:id
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await User.findOneAndDelete({ _id: req.params.id, role: "student" });
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    // Also remove linked parent
    await User.deleteMany({ student: req.params.id, role: "parent" });
    res.json({ success: true, message: "Student (and linked parent) deleted" });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/students/:id/reset-password  — warden resets student password
exports.resetStudentPassword = async (req, res, next) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: "student" }).select("+password");
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const plainPassword = generatePassword();
    student.password = plainPassword;
    student.mustChangePassword = true;
    await student.save();

    res.json({
      success: true,
      message: "Password reset",
      generatedPassword: plainPassword,
    });
  } catch (err) {
    next(err);
  }
};

// ── Parent Management ─────────────────────────────────────────────────────────

// GET /api/admin/parents
exports.getParents = async (req, res, next) => {
  try {
    const parents = await User.find({ role: "parent" })
      .populate("student", "name rollNumber email")
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, parents });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/parents  — warden creates a parent account and links to student
exports.createParent = async (req, res, next) => {
  try {
    const { name, email, phone, relation, studentId } = req.body;
    if (!name || !email || !studentId)
      return res.status(400).json({ success: false, message: "name, email, studentId required" });

    const student = await User.findOne({ _id: studentId, role: "student" });
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const plainPassword = generatePassword();

    const parent = await User.create({
      name,
      email,
      password: plainPassword,
      role: "parent",
      phone,
      relation,
      student: studentId,
      profileInitials: name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
      mustChangePassword: true,
    });

    // Back-link parent on student
    await User.findByIdAndUpdate(studentId, { parent: parent._id });

    res.status(201).json({
      success: true,
      message: "Parent account created",
      parent: {
        id: parent._id,
        name: parent.name,
        email: parent.email,
        relation: parent.relation,
        student: { id: student._id, name: student.name, rollNumber: student.rollNumber },
      },
      generatedPassword: plainPassword,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/parents/:id
exports.updateParent = async (req, res, next) => {
  try {
    const allowed = ["name", "email", "phone", "relation"];
    const update = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

    const parent = await User.findOneAndUpdate(
      { _id: req.params.id, role: "parent" },
      update,
      { new: true, runValidators: true }
    ).select("-password");

    if (!parent) return res.status(404).json({ success: false, message: "Parent not found" });
    res.json({ success: true, parent });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/parents/:id
exports.deleteParent = async (req, res, next) => {
  try {
    const parent = await User.findOneAndDelete({ _id: req.params.id, role: "parent" });
    if (!parent) return res.status(404).json({ success: false, message: "Parent not found" });
    // Remove back-link on student
    if (parent.student) await User.findByIdAndUpdate(parent.student, { $unset: { parent: 1 } });
    res.json({ success: true, message: "Parent deleted" });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/parents/:id/reset-password
exports.resetParentPassword = async (req, res, next) => {
  try {
    const parent = await User.findOne({ _id: req.params.id, role: "parent" }).select("+password");
    if (!parent) return res.status(404).json({ success: false, message: "Parent not found" });

    const plainPassword = generatePassword();
    parent.password = plainPassword;
    parent.mustChangePassword = true;
    await parent.save();

    res.json({ success: true, message: "Password reset", generatedPassword: plainPassword });
  } catch (err) {
    next(err);
  }
};
