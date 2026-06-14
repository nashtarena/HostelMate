const router = require("express").Router();
const ctrl = require("../controllers/adminController");
const { protect, authorise } = require("../middleware/auth");

router.use(protect, authorise("warden", "admin"));

// Dashboard
router.get("/stats", ctrl.getDashboardStats);

// Students
router.get("/students",                        ctrl.getStudents);
router.post("/students",                       ctrl.createStudent);
router.patch("/students/:id",                  ctrl.updateStudent);
router.delete("/students/:id",                 ctrl.deleteStudent);
router.post("/students/:id/reset-password",    ctrl.resetStudentPassword);

// Parents
router.get("/parents",                         ctrl.getParents);
router.post("/parents",                        ctrl.createParent);
router.patch("/parents/:id",                   ctrl.updateParent);
router.delete("/parents/:id",                  ctrl.deleteParent);
router.post("/parents/:id/reset-password",     ctrl.resetParentPassword);

module.exports = router;
