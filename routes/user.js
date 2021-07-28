var express = require("express");
const userController = require("../controllers/userController");

var router = express.Router();

router.get("/", userController.userList);
router.get("/:id", userController.userDetail);
router.post("/", userController.userStore);

module.exports = router;
