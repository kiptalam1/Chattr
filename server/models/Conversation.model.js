import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
				required: true,
			},
		],
		lastMessage: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "PrivateMessage",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
