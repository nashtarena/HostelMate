const Visitor = require("../models/Visitor");

// GET /api/visitors  — student sees own, warden/admin sees all
exports.getVisitors = async (req, res, next) => {
  try {
    const filter = req.user.role === "student" ? { student: req.user._id } : {};
    const visitors = await Visitor.find(filter)
      .populate("student", "name rollNumber room block")
      .sort("-scheduledAt");
    res.json(visitors);
  } catch (err) {
    next(err);
  }
};

// POST /api/visitors
exports.addVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.create({ ...req.body, student: req.user._id });
    res.status(201).json(visitor);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/visitors/:id/checkin
exports.checkIn = async (req, res, next) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status: "Checked In", checkedInAt: new Date() },
      { new: true }
    );
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    res.json(visitor);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/visitors/:id/checkout
exports.checkOut = async (req, res, next) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status: "Checked Out", checkedOutAt: new Date() },
      { new: true }
    );
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });
    res.json(visitor);
  } catch (err) {
    next(err);
  }
};
