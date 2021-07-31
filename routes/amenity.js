var express = require("express");
const amenityController = require("../controllers/amenityController");
//const auth = require('../middlewares/auth');
//const role = require('../helpers/roles');

var router = express.Router();

router.get("/", amenityController.amenityList);
router.get("/:id", amenityController.amenityDetail);
router.post("/", amenityController.amenityStore);

module.exports = router;
