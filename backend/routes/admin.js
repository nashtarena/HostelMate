const router = require("express").Router();
const { getDashboardStats } = require("../controllers/adminController");
const { protect, authorise } = require("../middleware/auth");

router.use(protect, authorise("warden", "admin"));

router.get("/stats", getDashboardStats);

module.exports = router;
