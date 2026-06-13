const Fee = require("../models/Fee");

// GET /api/fees  — student sees own, warden/admin see all
exports.getFees = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "student" ? { student: req.user._id } : {};
    const { status } = req.query;
    if (status) filter.status = status;

    const fees = await Fee.find(filter)
      .populate("student", "name rollNumber room")
      .sort("-createdAt");
    res.json(fees);
  } catch (err) {
    next(err);
  }
};

// GET /api/fees/summary  — outstanding total for logged-in student
exports.getMyFeeSummary = async (req, res, next) => {
  try {
    const fees = await Fee.find({ student: req.user._id });
    const outstanding = fees
      .filter((f) => f.status !== "Paid")
      .reduce((sum, f) => sum + f.amount, 0);
    const paid = fees
      .filter((f) => f.status === "Paid")
      .reduce((sum, f) => sum + f.amount, 0);
    res.json({ outstanding, paid, fees });
  } catch (err) {
    next(err);
  }
};

// POST /api/fees  (warden/admin — create a fee record)
exports.createFee = async (req, res, next) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/fees/:id/pay  — mark as paid (student initiates, or admin confirms)
exports.payFee = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    // Students can only pay their own fees
    if (req.user.role === "student" && fee.student.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your fee record" });

    fee.status = "Paid";
    fee.paidAt = new Date();
    await fee.save();
    res.json(fee);
  } catch (err) {
    next(err);
  }
};

// GET /api/fees/admin/summary  (warden/admin — collection stats)
exports.getAdminFeeSummary = async (req, res, next) => {
  try {
    const all = await Fee.find();
    const total = all.reduce((s, f) => s + f.amount, 0);
    const collected = all.filter((f) => f.status === "Paid").reduce((s, f) => s + f.amount, 0);
    const pending = all.filter((f) => f.status === "Pending").reduce((s, f) => s + f.amount, 0);
    res.json({ total, collected, pending, collectionRate: total ? Math.round((collected / total) * 100) : 0 });
  } catch (err) {
    next(err);
  }
};
