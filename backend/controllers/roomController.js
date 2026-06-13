const Room = require("../models/Room");
const User = require("../models/User");

// GET /api/rooms  — all rooms (warden/admin)
exports.getAllRooms = async (req, res, next) => {
  try {
    const { status, block } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (block) filter.block = block;
    const rooms = await Room.find(filter).populate("occupants", "name rollNumber profileInitials");
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

// GET /api/rooms/my  — student's own room
exports.getMyRoom = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "room",
      populate: { path: "occupants", select: "name course year phone profileInitials" },
    });
    if (!user.room) return res.status(404).json({ message: "No room assigned yet" });
    res.json(user.room);
  } catch (err) {
    next(err);
  }
};

// GET /api/rooms/:id
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate("occupants", "name rollNumber");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

// POST /api/rooms  (warden/admin)
exports.createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/rooms/:id  (warden/admin)
exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/rooms/:id/assign  — assign student to room (warden/admin)
exports.assignStudent = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.occupants.length >= room.capacity)
      return res.status(400).json({ message: "Room is full" });
    if (!room.occupants.includes(studentId)) {
      room.occupants.push(studentId);
      await room.save();
      await User.findByIdAndUpdate(studentId, { room: room._id, block: room.block });
    }
    res.json(room);
  } catch (err) {
    next(err);
  }
};
