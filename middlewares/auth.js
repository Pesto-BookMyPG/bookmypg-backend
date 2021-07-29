const jwt = require("jsonwebtoken");
const apiResponse = require("../helpers/apiResponse");

exports.protect = function (req, res, next) {
	// Get token from header
	const token = req.header("x-auth-token");

	// Check if no token
	if (!token) {
		return apiResponse.unauthorizedResponse(res, "Missing Token");
	}

	//Verify token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		apiResponse.unauthorizedResponse(res, "Invalid Token");
	}
};

exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return apiResponse.unauthorizedResponse(res, "Unauthorized Request");
		}
		next();
	};
};
