const router = require("express").Router();
const ROLES = require("../config/roles");
const userController = require("../controllers/userController");
// middlewares:
const userMWValidator = require("../middlewares/userMWValidator");
const verifyMWToken = require("../middlewares/verifyMWToken");
const userIdMWValidator = require("../middlewares/userIdMWValidator");
const verifyMWPermissions = require("../later/verifyMWPermissions");

// validate id param:
router.param("userId", userIdMWValidator);
router.use((req, res, nxt) => {
  if (req.method === "POST") {
    nxt();
  } else {
    return verifyMWToken(req, res, nxt);
  }
});

// 1) all users route:
router.get("/", verifyMWPermissions([ROLES.Admin]), userController.getAllUsers);
// 2) user route:
router.get("/:userId", userController.getUser);
// 3) new user route:
router.post("/", userMWValidator, userController.registerUser);
// 4) update user route:
router.put("/:userId", userMWValidator, userController.updateUser);
// 5) set new password route:
router.patch("/:userId", userController.setUserPassword);
// 5) set new password route:
router.patch("/:userId/meta-data", userController.updateUserMetaData);
// 6) delete user route:
router.delete("/:userId", userController.deleteUser);
// 7) delete all users route:
router.delete(
  "/",
  verifyMWPermissions([ROLES.Admin]),
  userController.deleteAllUsers
);

module.exports = router;
