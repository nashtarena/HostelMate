const router = require("express").Router();
const c = require("../controllers/feeController");
const { protect, authorise } = require("../middleware/auth");

router.use(protect);

router.get("/summary/admin", authorise("warden", "admin"), c.getAdminFeeSummary);
router.get("/summary", c.getMyFeeSummary);
router.get("/", c.getFees);
router.post("/", authorise("warden", "admin"), c.createFee);
router.patch("/:id/pay", c.payFee);

module.exports = router;
