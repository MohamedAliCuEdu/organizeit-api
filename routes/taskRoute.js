const router = require("express").Router();

// middlewares:
const userIdMWValidator = require("../middlewares/userIdMWValidator");
const taskIdMWValidator = require("../middlewares/taskIdMWValidator");
const taskController = require("../controllers/taskController");
const taskMWValidator = require("../middlewares/taskMWValidator");
const verifyMWToken = require("../middlewares/verifyMWToken");

// validate id param:
router.param("userId", userIdMWValidator);
router.param("taskId", taskIdMWValidator);
router.use(verifyMWToken);

// 1) all tasks route:
router.get("/:userId", taskController.getAllTasks);
// 2) task route:
router.get("/:userId/:taskId", taskController.getTask);
// 3) new task route:
router.post("/:userId", taskMWValidator, taskController.addNewTask);
// 4) update task route:
router.put("/:userId/:taskId", taskMWValidator, taskController.updateTask);
// 4) update task route:
router.patch(
  "/:userId/:taskId/complete",
  taskMWValidator,
  taskController.taskComplete
);
// 6) delete task route:
router.delete("/:userId/:taskId", taskController.deleteTask);
// 7) delete all tasks route:
router.delete("/:userId", taskController.deleteAllTasks);

module.exports = router;
