import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		roomId: {
			type: String,
			default: "global",
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
		readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
