var mongoose = require("mongoose");

var ReviewSchema = new mongoose.Schema(
	{
		rating: { type: Number, required: true },
		description: { type: String },
		reviewedby: { type: mongoose.Types.ObjectId, ref: "user" },
		property: { type: mongoose.Types.ObjectId, ref: "property" },
		isactive: { type: Boolean, required: true, default: 1 },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("review", ReviewSchema);
