const mongoose = require("mongoose");
const db = process.env.MONGODB_URL;

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connected...");
	} catch (err) {
		console.log(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
