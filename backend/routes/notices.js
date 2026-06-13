const router = require("express").Router();
const c = require("../controllers/noticeController");
const { protect, authorise } = require("../middleware/auth");

router.use(protect);

router.get("/", c.getNotices);
router.post("/", authorise("warden", "admin"), c.createNotice);
router.patch("/:id", authorise("warden", "admin"), c.updateNotice);
router.delete("/:id", authorise("warden", "admin"), c.deleteNotice);

module.exports = router;
