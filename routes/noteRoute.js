const router = require("express").Router();

// middlewares:
const userIdMWValidator = require("../middlewares/userIdMWValidator");
const noteController = require("../controllers/noteController");
const noteMWValidator = require("../middlewares/noteMWValidator");
const noteIdMWValidator = require("../middlewares/noteIdMWValidator");
const verifyMWToken = require("../middlewares/verifyMWToken");

// validate id param:
router.param("userId", userIdMWValidator);
router.param("noteId", noteIdMWValidator);
router.use(verifyMWToken);

// 1) all tasks route:
router.get("/:userId", noteController.getAllNotes);
// 1) all tasks route:
router.get("/:userId/tags", noteController.getAllTags);
// 2) task route:
router.get("/:userId/:noteId", noteController.getNote);
// 3) new task route:
router.post("/:userId", noteMWValidator, noteController.addNewNote);
// 4) update task route:
router.put("/:userId/:noteId", noteMWValidator, noteController.updateNote);
// 4) update task route:
router.patch("/:userId/:noteId", noteController.archiveNote);
// 6) delete task route:
router.delete("/:userId/:noteId", noteController.deleteNote);
// 7) delete all tasks route:
router.delete("/:userId", noteController.deleteAllNotes);

module.exports = router;
