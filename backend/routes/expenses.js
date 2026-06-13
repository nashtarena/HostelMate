const router = require("express").Router();
const c = require("../controllers/expenseController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/balance", c.getMyBalance);
router.get("/", c.getExpenses);
router.post("/", c.createExpense);
router.patch("/:id/settle", c.settle);

module.exports = router;
