const { MessMenu, MessFeedback } = require("../models/Mess");

// GET /api/mess/menu?date=YYYY-MM-DD  (defaults to today)
exports.getMenu = async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    date.setHours(0, 0, 0, 0);
    const menu = await MessMenu.findOne({ date });
    if (!menu) return res.status(404).json({ message: "No menu for this date" });
    res.json(menu);
  } catch (err) {
    next(err);
  }
};

// GET /api/mess/menu/week  — next 7 days
exports.getWeekMenu = async (req, res, next) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const menus = await MessMenu.find({ date: { $gte: start, $lte: end } }).sort("date");
    res.json(menus);
  } catch (err) {
    next(err);
  }
};

// POST /api/mess/menu  (warden/admin)
exports.createMenu = async (req, res, next) => {
  try {
    const menu = await MessMenu.create(req.body);
    res.status(201).json(menu);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/mess/menu/:id  (warden/admin)
exports.updateMenu = async (req, res, next) => {
  try {
    const menu = await MessMenu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!menu) return res.status(404).json({ message: "Menu not found" });
    res.json(menu);
  } catch (err) {
    next(err);
  }
};

// POST /api/mess/feedback
exports.submitFeedback = async (req, res, next) => {
  try {
    const fb = await MessFeedback.findOneAndUpdate(
      { student: req.user._id, menuDate: req.body.menuDate, meal: req.body.meal },
      { ...req.body, student: req.user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(fb);
  } catch (err) {
    next(err);
  }
};

// GET /api/mess/feedback/ratings  — avg rating per day (last 10 days)
exports.getRatingTrends = async (req, res, next) => {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 10);
    const data = await MessFeedback.aggregate([
      { $match: { menuDate: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$menuDate" } },
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    next(err);
  }
};
