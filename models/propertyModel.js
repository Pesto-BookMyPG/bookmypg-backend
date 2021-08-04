var mongoose = require("mongoose");

var PropertySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		location: { type: mongoose.Types.ObjectId, ref: "location" },
		address: { type: String, required: true },
		description: { type: String, required: true },
		rent: { type: Number, required: true },
		totalbeds: { type: Number, required: true },
		photos: { type: Array, required: true },
		amenities: { type: Array, ref: "amenity" },
		owner: { type: mongoose.Types.ObjectId, ref: "user" },
		isactive: { type: Boolean, required: true, default: 1 },
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } },
	{ timestamps: true },
);

PropertySchema.virtual("numreviews", {
	ref: "review",
	localField: "_id",
	foreignField: "property",
	count: true,
});

module.exports = mongoose.model("property", PropertySchema);
