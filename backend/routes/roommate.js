const router = require("express").Router();
const c = require("../controllers/roommateController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/preferences", c.getMyPrefs);
router.put("/preferences", c.savePrefs);
router.get("/matches", c.getMatches);

module.exports = router;
