const router = require("express").Router();
const c = require("../controllers/complaintController");
const { protect, authorise } = require("../middleware/auth");

router.use(protect);

router.get("/", c.getComplaints);
router.post("/", c.createComplaint);
router.patch("/:id/status", authorise("warden", "admin"), c.updateStatus);
router.post("/:id/vote", c.toggleVote);

module.exports = router;
