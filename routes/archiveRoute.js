const router = require("express").Router();
const archiveController = require("../controllers/archiveController");

// middlewares:
const userIdMWValidator = require("../middlewares/userIdMWValidator");
const noteIdMWValidator = require("../middlewares/noteIdMWValidator");
const verifyMWToken = require("../middlewares/verifyMWToken");

// validate id param:
router.param("userId", userIdMWValidator);
router.param("noteId", noteIdMWValidator);
router.use(verifyMWToken);

// 4) update task route:
router.patch("/:userId/:noteId", archiveController.archiveNote);
// 7) delete all tasks route:
router.delete("/:userId", archiveController.deleteNotesArchive);
// 7) delete all tasks route:
router.patch("/:userId", archiveController.unArchiveAllNotes);

module.exports = router;
