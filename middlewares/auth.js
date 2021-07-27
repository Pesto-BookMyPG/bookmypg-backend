const jwt = require("jsonwebtoken");
const apiResponse = require("../helpers/apiResponse");

module.exports = function (req, res, next) {
	//Get token from header
	const token = req.header("x-auth-token");

	//Check if no token
	if (!token) {
		return apiResponse.unauthorizedResponse(res, "No token");
	}

	//Verify token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded.user;
		next();
	} catch (err) {
		apiResponse.ErrorResponse(res, err);
	}
};
