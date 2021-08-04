var admin = require("firebase-admin");
const apiResponse = require("../helpers/apiResponse");

exports.protect = function (req, res, next) {
	// Get token from header
	const token = req.header("x-auth-token");

	// Check if no token
	if (!token) {
		return apiResponse.unauthorizedResponse(res, "Missing Token");
	}

	//Verify token

	admin
		.auth()
		.verifyIdToken(token)
		.then(decodedToken => {
			console.log(decodedToken);
			const uid = decodedToken.uid;
			req.user = uid;
			next();
		})
		.catch(error => {
			// Handle error
			console.log(error);
			apiResponse.unauthorizedResponse(res, "Invalid Token");
		});
};
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return apiResponse.unauthorizedResponse(res, "Unauthorized Request");
		}
		next();
	};
};
