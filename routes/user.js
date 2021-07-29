var express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const role = require("../helpers/roles");

var router = express.Router();

router.get(
	"/",
	auth.protect,
	auth.restrictTo(role.Admin, role.User),
	userController.userList,
);
router.get(
	"/:id",
	auth.protect,
	auth.restrictTo(role.Admin, role.User),
	userController.userDetail,
);
router.post("/", userController.userStore);

module.exports = router;
