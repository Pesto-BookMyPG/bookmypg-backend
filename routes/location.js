var express = require("express");
const locationController = require("../controllers/locationController");
//const auth = require('../middlewares/auth');
//const role = require('../helpers/roles');

var router = express.Router();

router.get("/", locationController.locationList);
router.post("/", locationController.locationStore);

module.exports = router;
