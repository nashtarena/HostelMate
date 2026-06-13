const User = require("../models/User");
const Room = require("../models/Room");
const Complaint = require("../models/Complaint");
const Leave = require("../models/Leave");
const Fee = require("../models/Fee");
const { MessFeedback } = require("../models/Mess");

// GET /api/admin/stats  — all overview numbers for AdminDashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      rooms,
      openComplaints,
      pendingLeaves,
      fees,
      recentFeedback,
    ] = await Promise.all([
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

    const avgMessRating =
      recentFeedback.length
        ? (recentFeedback.reduce((s, f) => s + f.rating, 0) / recentFeedback.length).toFixed(1)
        : null;

    // Complaint trend: last 12 days, grouped by category
    const since = new Date(Date.now() - 12 * 86400000);
    const trend = await Complaint.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%b %d", date: "$createdAt" } },
            cat: "$category",
          },
          count: { $sum: 1 },
        },
      },
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
      rooms, // for occupancy map
    });
  } catch (err) {
    next(err);
  }
};
