var express = require("express");
const complaintController = require("../controllers/complaintController");
//const auth = require('../middlewares/auth');
//const role = require('../helpers/roles');

var router = express.Router();

router.get("/", complaintController.complaintList);
router.get("/:id", complaintController.complaintDetail);
router.post("/", complaintController.complaintStore);
router.put("/:id", complaintController.complaintUpdate);

module.exports = router;
