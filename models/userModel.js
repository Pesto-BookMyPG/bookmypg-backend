var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String },
		role: {
			type: String,
			enum: ["admin", "user", "owner"],
			required: true,
			default: "user",
		},
		isactive: { type: Boolean, required: true, default: 1 },
	},
	{ timestamps: true },
);

// Virtual for user's full name
UserSchema.virtual("fullName").get(function () {
	return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model("User", UserSchema);
