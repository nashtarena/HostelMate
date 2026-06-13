const router = require("express").Router();
const c = require("../controllers/visitorController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", c.getVisitors);
router.post("/", c.addVisitor);
router.patch("/:id/checkin", c.checkIn);
router.patch("/:id/checkout", c.checkOut);

module.exports = router;
