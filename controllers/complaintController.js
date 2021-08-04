const Complaint = require("../models/complaintModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// User Schema
function ComplaintData(data) {
	this.id = data._id;
	this.status = data.status;
	this.description = data.description;
	this.email = data.email;
	this.phone = data.phone;
	this.raisedby = data.raisedby;
	this.property = data.property;
	this.isactive = data.isactive;
}

/**
 * Complaint List.
 *
 * @returns {Object}
 */
exports.complaintList = [
	function (req, res) {
		try {
			Complaint.find()
				.populate("property", ["name"])
				.populate("raisedby", ["firstName", "lastName"])
				.then(complaints => {
					if (complaints.length > 0) {
						return apiResponse.successResponseWithData(
							res,
							"Operation success",
							complaints,
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
 * Complaint Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.complaintDetail = [
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid ID");
		}
		try {
			Complaint.findOne({ _id: req.params.id })
				.populate("property", ["name"])
				.populate("raisedby", ["firstName", "lastName"])
				.then(complaint => {
					if (complaint !== null) {
						let complaintData = new ComplaintData(complaint);
						return apiResponse.successResponseWithData(
							res,
							"Operation success",
							complaintData,
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
 * Complaint store.
 *
 * @param {string}      rating
 * @param {string}      description
 *
 * @returns {Object}
 */
exports.complaintStore = [
	// Validate fields.
	body("description")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Description must be specified."),
	body("email")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Email must be specified.")
		.isEmail()
		.withMessage("Email must be a valid email address."),
	sanitizeBody("description").escape(),
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
				// Create Complaint object with escaped and trimmed data
				var complaint = new Complaint({
					email: req.body.email,
					phone: req.body.phone,
					description: req.body.description,
					raisedby: req.body.raisedby,
					property: req.body.property,
				});

				// Save complaint.
				complaint.save(function (err) {
					if (err) {
						return apiResponse.ErrorResponse(res, err);
					}
					let complaintData = {
						_id: complaint._id,
						email: complaint.email,
						phone: complaint.phone,
						description: complaint.description,
						raisedby: complaint.raisedby,
						property: complaint.property,
						status: complaint.status,
					};
					return apiResponse.successResponseWithData(
						res,
						"Complaint add Success.",
						complaintData,
					);
				});
			}
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];

/**
 * Complaint update.
 *
 * @param {string}      status
 *
 *
 * @returns {Object}
 */
exports.complaintUpdate = [
	body("status", "Status must not be empty.").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var complaint = req.body;
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(
					res,
					"Validation Error.",
					errors.array(),
				);
			} else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(
						res,
						"Invalid Error.",
						"Invalid ID",
					);
				} else {
					Complaint.findById(req.params.id, function (err, foundComplaint) {
						if (foundComplaint === null) {
							return apiResponse.notFoundResponse(
								res,
								"Complaint does not exist with this id",
							);
						} else {
							//update complaint.
							Complaint.findByIdAndUpdate(
								req.params.id,
								complaint,
								function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									} else {
										let complaintData = new ComplaintData(complaint);
										return apiResponse.successResponseWithData(
											res,
											"Complaint update Success.",
											complaintData,
										);
									}
								},
							);
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
