require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Global middleware ─────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",       require("./routes/auth"));
app.use("/api/rooms",      require("./routes/rooms"));
app.use("/api/complaints", require("./routes/complaints"));
app.use("/api/leaves",     require("./routes/leaves"));
app.use("/api/fees",       require("./routes/fees"));
app.use("/api/mess",       require("./routes/mess"));
app.use("/api/visitors",   require("./routes/visitors"));
app.use("/api/expenses",   require("./routes/expenses"));
app.use("/api/notices",    require("./routes/notices"));
app.use("/api/roommate",   require("./routes/roommate"));
app.use("/api/admin",      require("./routes/admin"));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`HostelMate API running on port ${PORT}`));
