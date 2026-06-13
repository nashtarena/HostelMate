/**
 * Seed script — run once: node seed.js
 * Creates sample users, rooms, complaints, notices, mess menu, fees.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User        = require("./models/User");
const Room        = require("./models/Room");
const Complaint   = require("./models/Complaint");
const Notice      = require("./models/Notice");
const { MessMenu } = require("./models/Mess");
const Fee         = require("./models/Fee");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB — seeding...");

  // Clear collections
  await Promise.all([
    User.deleteMany(), Room.deleteMany(), Complaint.deleteMany(),
    Notice.deleteMany(), MessMenu.deleteMany(), Fee.deleteMany(),
  ]);

  // ── Users ────────────────────────────────────────────────────────────────
  const hash = (p) => bcrypt.hash(p, 12);

  const [warden, student1, student2, student3] = await User.insertMany([
    { name: "Dr. Ramesh Kumar", email: "warden@hostel.edu",   password: await hash("warden123"),  role: "warden",  profileInitials: "WR" },
    { name: "Natasha Avery",    email: "natasha@hostel.edu",  password: await hash("student123"), role: "student", rollNumber: "CS2021045", course: "B.Tech Computer Science", year: 3, phone: "+91 9876543210", profileInitials: "NA" },
    { name: "Priya Sharma",     email: "priya@hostel.edu",    password: await hash("student123"), role: "student", rollNumber: "EC2021032", course: "B.Tech ECE", year: 3, profileInitials: "PS" },
    { name: "Divya Nair",       email: "divya@hostel.edu",    password: await hash("student123"), role: "student", rollNumber: "CS2022011", course: "B.Tech CSE", year: 2, profileInitials: "DN" },
  ]);

  // ── Rooms ────────────────────────────────────────────────────────────────
  const room204 = await Room.create({
    number: "204", floor: 2, block: "B", type: "Double",
    capacity: 2, monthlyRent: 4200,
    amenities: ["WiFi", "Fan", "Attached Bath", "Study Table"],
    occupants: [student1._id, student2._id],
  });
  await Room.create([
    { number: "101", floor: 1, block: "A", type: "Single",  capacity: 1, monthlyRent: 3500, occupants: [student3._id] },
    { number: "310", floor: 3, block: "C", type: "Double",  capacity: 2, status: "Maintenance" },
    { number: "401", floor: 4, block: "A", type: "Single",  capacity: 1 },
    { number: "305", floor: 3, block: "B", type: "Triple",  capacity: 3 },
  ]);

  // Link students to rooms
  await User.findByIdAndUpdate(student1._id, { room: room204._id, block: "B" });
  await User.findByIdAndUpdate(student2._id, { room: room204._id, block: "B" });
  await User.findByIdAndUpdate(student3._id, { block: "A" });

  // ── Complaints ───────────────────────────────────────────────────────────
  await Complaint.insertMany([
    { raisedBy: student1._id, category: "Electrical", title: "Fan not working", description: "The ceiling fan in room 204 stopped working.", priority: "Urgent", status: "In Progress" },
    { raisedBy: student2._id, category: "Plumbing",   title: "Leaking tap",     description: "Washroom tap leaking for 2 days.", priority: "High",   status: "Open" },
    { raisedBy: student1._id, category: "Maintenance", title: "Door lock broken", description: "Room door doesn't lock properly.", priority: "Medium", status: "Resolved" },
  ]);

  // ── Notices ──────────────────────────────────────────────────────────────
  await Notice.insertMany([
    { title: "Hostel Fee Payment Deadline Extended", content: "Fee deadline extended to July 5th, 2024.", category: "Urgent", postedBy: warden._id, pinned: true },
    { title: "Inter-Hostel Sports Meet", content: "Annual sports meet on June 20–22.", category: "Event", postedBy: warden._id },
    { title: "Water Supply Disruption", content: "Water off June 15, 9 AM–1 PM.", category: "Maintenance", postedBy: warden._id },
  ]);

  // ── Mess Menu ────────────────────────────────────────────────────────────
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const menus = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); d.setHours(0,0,0,0);
    return {
      date: d, dayLabel: days[d.getDay() === 0 ? 6 : d.getDay() - 1],
      breakfast: ["Idli Sambar","Poha","Boiled Eggs","Toast & Butter","Chai"],
      lunch:     ["Dal Tadka","Aloo Gobi","Jeera Rice","Roti","Salad","Buttermilk"],
      snacks:    ["Samosa","Chai","Bread Pakora","Banana"],
      dinner:    ["Paneer Butter Masala","Chapati","Rice","Dal Fry","Kheer"],
    };
  });
  await MessMenu.insertMany(menus);

  // ── Fees ─────────────────────────────────────────────────────────────────
  const jul1 = new Date("2024-07-01");
  await Fee.insertMany([
    { student: student1._id, type: "Hostel Rent",   month: "June 2024", amount: 4200, dueDate: jul1, status: "Pending" },
    { student: student1._id, type: "Mess Charges",  month: "June 2024", amount: 2800, dueDate: jul1, status: "Pending" },
    { student: student1._id, type: "Hostel Rent",   month: "May 2024",  amount: 4200, dueDate: new Date("2024-06-01"), status: "Paid", paidAt: new Date("2024-05-28") },
    { student: student1._id, type: "Mess Charges",  month: "May 2024",  amount: 2800, dueDate: new Date("2024-06-01"), status: "Paid", paidAt: new Date("2024-05-28") },
    { student: student1._id, type: "Electricity",   month: "May 2024",  amount: 320,  dueDate: new Date("2024-06-01"), status: "Overdue" },
  ]);

  console.log("Seed complete!");
  console.log("\nLogin credentials:");
  console.log("  Warden  → warden@hostel.edu   / warden123");
  console.log("  Student → natasha@hostel.edu  / student123");
  await mongoose.disconnect();
};

run().catch((e) => { console.error(e); process.exit(1); });
