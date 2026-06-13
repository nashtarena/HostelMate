const Complaint = require("../models/Complaint");

// GET /api/complaints  — students see own, warden/admin see all
exports.getComplaints = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (req.user.role === "student") filter.raisedBy = req.user._id;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const complaints = await Complaint.find(filter)
      .populate("raisedBy", "name rollNumber room")
      .sort("-createdAt");
    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

// POST /api/complaints
exports.createComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.create({ ...req.body, raisedBy: req.user._id });
    res.status(201).json(complaint);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/complaints/:id/status  (warden/admin)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === "Resolved" ? { resolvedAt: new Date() } : {}) },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (err) {
    next(err);
  }
};

// POST /api/complaints/:id/vote  — toggle upvote
exports.toggleVote = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const idx = complaint.votes.indexOf(req.user._id);
    if (idx === -1) complaint.votes.push(req.user._id);
    else complaint.votes.splice(idx, 1);
    await complaint.save();
    res.json({ votes: complaint.votes.length });
  } catch (err) {
    next(err);
  }
};
