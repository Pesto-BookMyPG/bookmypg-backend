var mongoose = require("mongoose");

var LocationSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		isactive: { type: Boolean, required: true, default: 1 },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("location", LocationSchema);
