const QRCode = require("qrcode");
const Leave = require("../models/Leave");

// GET /api/leaves
exports.getLeaves = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "student" ? { student: req.user._id } : {};
    const { status } = req.query;
    if (status) filter.status = status;

    const leaves = await Leave.find(filter)
      .populate("student", "name rollNumber room block")
      .populate("approvedBy", "name")
      .sort("-createdAt");
    res.json(leaves);
  } catch (err) {
    next(err);
  }
};

// POST /api/leaves
exports.applyLeave = async (req, res, next) => {
  try {
    const leave = await Leave.create({ ...req.body, student: req.user._id });
    res.status(201).json(leave);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/leaves/:id/approve  (warden/admin)
exports.approveLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id).populate(
      "student",
      "name rollNumber room block"
    );
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = "Approved";
    leave.approvedBy = req.user._id;
    leave.approvedAt = new Date();

    // Generate QR code containing gate-pass info
    const payload = JSON.stringify({
      student: leave.student.name,
      roll: leave.student.rollNumber,
      from: leave.from,
      to: leave.to,
      destination: leave.destination,
      approvedBy: req.user.name,
    });
    leave.qrCode = await QRCode.toDataURL(payload);

    await leave.save();
    res.json(leave);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/leaves/:id/reject  (warden/admin)
exports.rejectLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected", approvedBy: req.user._id },
      { new: true }
    );
    if (!leave) return res.status(404).json({ message: "Leave not found" });
    res.json(leave);
  } catch (err) {
    next(err);
  }
};
