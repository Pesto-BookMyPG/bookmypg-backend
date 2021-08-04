var express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const role = require("../helpers/roles");

var router = express.Router();

router.get("/", auth.protect, userController.userList);
router.get(
	"/:id",
	auth.protect,
	auth.restrictTo(role.Admin, role.User),
	userController.userDetail,
);
router.post("/", userController.userStore);
router.delete("/:id", userController.userDelete);

module.exports = router;
