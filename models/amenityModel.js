var mongoose = require("mongoose");

var AmenitySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		logo: { type: String, required: true },
		isactive: { type: Boolean, required: true, default: 1 },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("amenity", AmenitySchema);
