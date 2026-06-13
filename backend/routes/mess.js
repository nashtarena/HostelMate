const router = require("express").Router();
const c = require("../controllers/messController");
const { protect, authorise } = require("../middleware/auth");

router.use(protect);

router.get("/menu/week", c.getWeekMenu);
router.get("/menu", c.getMenu);
router.post("/menu", authorise("warden", "admin"), c.createMenu);
router.patch("/menu/:id", authorise("warden", "admin"), c.updateMenu);
router.post("/feedback", c.submitFeedback);
router.get("/feedback/ratings", c.getRatingTrends);

module.exports = router;
