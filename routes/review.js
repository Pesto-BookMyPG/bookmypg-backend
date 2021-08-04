var express = require("express");
const reviewController = require("../controllers/reviewController");
//const auth = require('../middlewares/auth');
//const role = require('../helpers/roles');

var router = express.Router();

router.get("/", reviewController.reviewList);
router.post("/", reviewController.reviewStore);

module.exports = router;
