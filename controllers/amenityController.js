const Amenity = require("../models/amenityModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
//const jwt = require('jsonwebtoken');

// Amenity Schema
function AmenityData(data) {
	this.id = data._id;
	this.name = data.name;
	this.logo = data.logo;
	this.isactive = data.isactive;
}

/**
 * Amenity List.
 *
 * @returns {Object}
 */
exports.amenityList = [
	function (req, res) {
		try {
			Amenity.find().then(amenities => {
				if (amenities.length > 0) {
					return apiResponse.successResponseWithData(
						res,
						"Operation success",
						amenities,
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
 * Amenity Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.amenityDetail = [
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid ID");
		}
		try {
			Amenity.findOne({ _id: req.params.id }).then(amenity => {
				if (amenity !== null) {
					let amenityData = new AmenityData(amenity);
					return apiResponse.successResponseWithData(
						res,
						"Operation success",
						amenityData,
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
 * Amenity store.
 *
 * @param {string}      name
 * @param {string}      logo
 *
 * @returns {Object}
 */
exports.amenityStore = [
	// Validate fields.
	body("name")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Name must be specified.")
		.isAlphanumeric()
		.withMessage("Name has non-alphanumeric characters."),
	body("logo")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Logo must be specified.")
		.custom(value => {
			return Amenity.findOne({ name: value }).then(amenity => {
				if (amenity) {
					return Promise.reject("Amenity name already in use");
				}
			});
		}),
	sanitizeBody("name").escape(),
	sanitizeBody("logo").escape(),
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
				// Create Amenity object with escaped and trimmed data
				var amenity = new Amenity({
					name: req.body.name,
					logo: req.body.logo,
				});

				// Save amenity.
				amenity.save(function (err) {
					if (err) {
						return apiResponse.ErrorResponse(res, err);
					}
					let amenityData = {
						_id: amenity._id,
						name: amenity.name,
						logo: amenity.logo,
					};
					return apiResponse.successResponseWithData(
						res,
						"Amenity add Success.",
						amenityData,
					);
				});
			}
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
