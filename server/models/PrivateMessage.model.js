import mongoose from "mongoose";

const PrivateMessageSchema = new mongoose.Schema(
	{
		conversationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Conversation",
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		readBy: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				default: [],
			},
		],
		reactions: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
					emoji: {
						type: String,
					},
				},
			},
		],
	},
	{ timestamps: true }
);

const PrivateMessage = mongoose.model("PrivateMessage", PrivateMessageSchema);

export default PrivateMessage;
