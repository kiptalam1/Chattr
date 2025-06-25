import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 50,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			select: false,
		},
		avatarSeed: {
			type: String,
			default: function () {
				return this.username; // Use username as seed by default
			},
		},
		avatarBgColor: {
			type: String,
			required: true, // Must be set manually in controller
		},
		avatarUrl: {
			type: String, // For custom uploads later
		},
		role: {
			type: String,
			enum: ["admin", "user"],
			default: "user",
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("User", UserSchema);
