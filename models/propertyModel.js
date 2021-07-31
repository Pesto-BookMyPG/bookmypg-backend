var mongoose = require("mongoose");

var PropertySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		location: { type: mongoose.Types.ObjectId, required: true },
		address: { type: String, required: true },
		description: { type: String, required: true },
		rent: { type: Number, required: true },
		totalbeds: { type: Number, required: true },
		photos: { type: Array, required: true },
		amenities: { type: Array, required: true },
		owner: { type: mongoose.Types.ObjectId, required: true },
		isactive: { type: Boolean, required: true, default: 1 },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("Property", PropertySchema);
