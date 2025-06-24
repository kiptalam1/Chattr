import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		recipient: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		roomId: {
			type: String,
			default: null,
		},
		content: {
			type: String,
			default: "",
		},
		reactions: [
			{
				user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
				emoji: String,
			},
		],
		readBy: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
