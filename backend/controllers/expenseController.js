const Expense = require("../models/Expense");
const User = require("../models/User");

// GET /api/expenses  — expenses for the student's room
exports.getExpenses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const expenses = await Expense.find({ room: user.room })
      .populate("paidBy", "name profileInitials")
      .populate("splitAmong", "name profileInitials")
      .sort("-createdAt");
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

// GET /api/expenses/balance  — net balance for logged-in student
exports.getMyBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const expenses = await Expense.find({ room: user.room })
      .populate("paidBy splitAmong settled");

    let net = 0;
    expenses.forEach((e) => {
      const share = e.amount / e.splitAmong.length;
      const iAmPayer = e.paidBy._id.toString() === req.user._id.toString();
      const iAmSplitter = e.splitAmong.some((u) => u._id.toString() === req.user._id.toString());
      const iSettled = e.settled.some((u) => u._id.toString() === req.user._id.toString());

      if (iAmPayer) {
        // Others owe me their shares
        net += e.amount - share; // minus my own share
      } else if (iAmSplitter && !iSettled) {
        net -= share;
      }
    });
    res.json({ net: Math.round(net) });
  } catch (err) {
    next(err);
  }
};

// POST /api/expenses
exports.createExpense = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const expense = await Expense.create({
      ...req.body,
      paidBy: req.user._id,
      room: user.room,
    });
    res.status(201).json(expense);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/expenses/:id/settle  — mark current user as settled
exports.settle = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (!expense.settled.includes(req.user._id)) {
      expense.settled.push(req.user._id);
      await expense.save();
    }
    res.json(expense);
  } catch (err) {
    next(err);
  }
};
