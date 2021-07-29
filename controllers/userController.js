const User = require("../models/userModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const jwt = require("jsonwebtoken");

// User Schema
function UserData(data) {
	this.id = data._id;
	this.firstname = data.firstName;
	this.lastname = data.lastName;
	this.email = data.email;
	this.phone = data.phone;
	this.role = data.role;
	this.isactive = data.isactive;
}

/**
 * User List.
 *
 * @returns {Object}
 */
exports.userList = [
	function (req, res) {
		try {
			User.find().then(users => {
				if (users.length > 0) {
					return apiResponse.successResponseWithData(
						res,
						"Operation success",
						users,
					);
				} else {
					return apiResponse.successResponseWithData(
						res,
						"Operation success",
						[],
					);
				}
			});
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * User Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.userDetail = [
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid ID");
		}
		try {
			User.findOne({ _id: req.params.id }).then(user => {
				if (user !== null) {
					let userData = new UserData(user);
					return apiResponse.successResponseWithData(
						res,
						"Operation success",
						userData,
					);
				} else {
					return apiResponse.notFoundResponse(
						res,
						"No record found with this ID",
					);
				}
			});
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * User store.
 *
 * @param {string}      firstname
 * @param {string}      lastname
 * @param {string}      email
 *
 * @returns {Object}
 */
exports.userStore = [
	// Validate fields.
	body("firstName")
		.isLength({ min: 1 })
		.trim()
		.withMessage("First name must be specified.")
		.isAlphanumeric()
		.withMessage("First name has non-alphanumeric characters."),
	body("lastName")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Last name must be specified.")
		.isAlphanumeric()
		.withMessage("Last name has non-alphanumeric characters."),
	body("email")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Email must be specified.")
		.isEmail()
		.withMessage("Email must be a valid email address.")
		.custom(value => {
			return User.findOne({ email: value }).then(user => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),
	sanitizeBody("firstName").escape(),
	sanitizeBody("lastName").escape(),
	sanitizeBody("email").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return apiResponse.validationErrorWithData(
					res,
					"Validation Error.",
					errors.array(),
				);
			} else {
				// Create User object with escaped and trimmed data
				var user = new User({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					email: req.body.email,
					phone: req.body.phone,
				});

				// Save user.
				user.save(function (err) {
					if (err) {
						return apiResponse.ErrorResponse(res, err);
					}
					let userData = {
						_id: user._id,
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email,
						phone: user.phone,
						role: user.role,
					};
					//Prepare JWT token for authentication
					const jwtPayload = userData;
					const jwtData = {
						expiresIn: process.env.JWT_TIMEOUT_DURATION,
					};
					const secret = process.env.JWT_SECRET;
					//Generated JWT token with Payload and secret.
					userData.token = jwt.sign(jwtPayload, secret, jwtData);
					return apiResponse.successResponseWithData(
						res,
						"User add Success.",
						userData,
					);
				});
			}
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
