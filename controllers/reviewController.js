const Review = require("../models/reviewModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

/**
 * Review List.
 *
 * @returns {Object}
 */
exports.reviewList = [
	function (req, res) {
		try {
			Review.find()
				.populate("property", ["name"])
				.populate("reviewedby", ["firstName", "lastName"])
				.then(reviews => {
					if (reviews.length > 0) {
						return apiResponse.successResponseWithData(
							res,
							"Operation success",
							reviews,
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
 * Review store.
 *
 * @param {string}      rating
 * @param {string}      description
 *
 * @returns {Object}
 */
exports.reviewStore = [
	// Validate fields.
	body("rating")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Rating must be specified.")
		.isNumeric()
		.withMessage("Rating has non-numeric characters."),
	sanitizeBody("rating").escape(),
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
				// Create Review object with escaped and trimmed data
				var review = new Review({
					rating: req.body.rating,
					description: req.body.description,
					reviewedby: req.body.reviewedby,
					property: req.body.property,
				});

				// Save review.
				review.save(function (err) {
					if (err) {
						return apiResponse.ErrorResponse(res, err);
					}
					let reviewData = {
						_id: review._id,
						rating: review.rating,
						description: review.description,
						reviewedby: review.reviewedby,
						property: review.property,
					};
					return apiResponse.successResponseWithData(
						res,
						"Review add Success.",
						reviewData,
					);
				});
			}
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
