import Message from "../models/Message.model.js";

export const getMessages = async (req, res) => {
	try {
		const { roomId = "global" } = req.query;
		const messages = await Message.find({ roomId })
			.sort({ createdAt: 1 })
			.populate("sender", "username")
			.populate("reactions.user", "username");

		res.status(200).json({
			success: true,
			data: messages,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Something went wrong." });
	}
};
