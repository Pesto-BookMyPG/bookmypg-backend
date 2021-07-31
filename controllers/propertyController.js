const Property = require("../models/propertyModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
//const jwt = require('jsonwebtoken');

// Property Schema
function PropertyData(data) {
	this.id = data._id;
	this.name = data.name;
	this.location = data.location;
	this.rent = data.rent;
	this.totalbeds = data.totalbeds;
	this.amenities = data.amenities;
	this.Owner = data.Owner;
	this.address = data.address;
	this.description = data.description;
	this.photos = data.photos;
	this.isactive = data.isactive;
}

/**
 * Property List.
 *
 * @returns {Object}
 */
exports.propertyList = [
	function (req, res) {
		try {
			Property.find().then(properties => {
				if (properties.length > 0) {
					return apiResponse.successResponseWithData(
						res,
						"Operation success",
						properties,
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
 * Property Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.propertyDetail = [
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid ID");
		}
		try {
			Property.findOne({ _id: req.params.id })
				.populate("location")
				.then(property => {
					if (property !== null) {
						let propertyData = new PropertyData(property);

						return apiResponse.successResponseWithData(
							res,
							"Operation success",
							propertyData,
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
 * Property store.
 *
 * @param {string}      name
 * @param {string}      logo
 *
 * @returns {Object}
 */
exports.propertyStore = [
	// Validate fields.
	body("description")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Description must be specified."),
	body("address")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Address must be specified."),
	body("name")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Name must be specified."),
	sanitizeBody("name").escape(),
	sanitizeBody("description").escape(),
	sanitizeBody("address").escape(),
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
				// Create Property object with escaped and trimmed data
				var property = new Property({
					name: req.body.name,
					location: req.body.location,
					address: req.body.address,
					description: req.body.description,
					rent: req.body.rent,
					totalbeds: req.body.totalbeds,
					amenities: req.body.amenities,
					owner: req.body.owner,
					photos: req.body.photos,
				});

				// Save property.
				property.save(function (err) {
					if (err) {
						return apiResponse.ErrorResponse(res, err);
					}
					let propertyData = {
						_id: property._id,
						name: property.name,

						location: property.location,
						address: property.address,
						description: property.description,
						rent: property.rent,
						totalbeds: property.totalbeds,
						amenities: property.amenities,
						photos: property.photos,
						owner: property.owner,
					};
					return apiResponse.successResponseWithData(
						res,
						"Property add Success.",
						propertyData,
					);
				});
			}
		} catch (err) {
			// Throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
	},
];
