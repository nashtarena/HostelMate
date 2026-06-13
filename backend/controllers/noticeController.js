const Notice = require("../models/Notice");

// GET /api/notices
exports.getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({
      $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
    })
      .populate("postedBy", "name role")
      .sort({ pinned: -1, createdAt: -1 });
    res.json(notices);
  } catch (err) {
    next(err);
  }
};

// POST /api/notices  (warden/admin)
exports.createNotice = async (req, res, next) => {
  try {
    const notice = await Notice.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json(notice);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notices/:id  (warden/admin)
exports.updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) return res.status(404).json({ message: "Notice not found" });
    res.json(notice);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notices/:id  (warden/admin)
exports.deleteNotice = async (req, res, next) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice deleted" });
  } catch (err) {
    next(err);
  }
};
