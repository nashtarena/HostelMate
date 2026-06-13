const RoommatePrefs = require("../models/RoommatePrefs");
const User = require("../models/User");

// GET /api/roommate/preferences  — my prefs
exports.getMyPrefs = async (req, res, next) => {
  try {
    const prefs = await RoommatePrefs.findOne({ student: req.user._id });
    res.json(prefs || {});
  } catch (err) {
    next(err);
  }
};

// PUT /api/roommate/preferences  — upsert my prefs
exports.savePrefs = async (req, res, next) => {
  try {
    const prefs = await RoommatePrefs.findOneAndUpdate(
      { student: req.user._id },
      { ...req.body, student: req.user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(prefs);
  } catch (err) {
    next(err);
  }
};

// GET /api/roommate/matches  — ranked list of compatible students
exports.getMatches = async (req, res, next) => {
  try {
    const myPrefs = await RoommatePrefs.findOne({ student: req.user._id });
    if (!myPrefs) return res.status(400).json({ message: "Set your preferences first" });

    // All other students' prefs (excluding self)
    const others = await RoommatePrefs.find({ student: { $ne: req.user._id } }).populate(
      "student",
      "name course year profileInitials"
    );

    const fields = ["sleep", "study", "clean", "guests"];

    const scored = others.map((o) => {
      let matchCount = 0;
      const matchedPrefs = fields.map((f) => {
        const match = myPrefs[f] === o[f] || myPrefs[f] === "Flexible" || o[f] === "Flexible";
        if (match) matchCount++;
        return match;
      });
      const compat = Math.round((matchCount / fields.length) * 100);
      return { student: o.student, compat, matchedPrefs, prefs: o };
    });

    scored.sort((a, b) => b.compat - a.compat);
    res.json(scored.slice(0, 10)); // top 10
  } catch (err) {
    next(err);
  }
};
