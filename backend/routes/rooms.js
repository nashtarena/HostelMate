const router = require("express").Router();
const c = require("../controllers/roomController");
const { protect, authorise } = require("../middleware/auth");

router.use(protect);

router.get("/my", c.getMyRoom);                                      // student's own room
router.get("/", authorise("warden", "admin"), c.getAllRooms);
router.get("/:id", c.getRoomById);
router.post("/", authorise("warden", "admin"), c.createRoom);
router.patch("/:id", authorise("warden", "admin"), c.updateRoom);
router.patch("/:id/assign", authorise("warden", "admin"), c.assignStudent);

module.exports = router;
