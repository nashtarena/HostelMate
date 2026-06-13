const router = require("express").Router();
const c = require("../controllers/leaveController");
const { protect, authorise } = require("../middleware/auth");

router.use(protect);

router.get("/", c.getLeaves);
router.post("/", c.applyLeave);
router.patch("/:id/approve", authorise("warden", "admin"), c.approveLeave);
router.patch("/:id/reject", authorise("warden", "admin"), c.rejectLeave);

module.exports = router;
