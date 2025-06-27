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

export const getPrivateMessagesHistory = async (req, res) => {
	try {
		const userId = req.user.id;

		if (!userId) {
			return res
				.status(401)
				.json({ success: false, message: "Please login in." });
		}
		// Extract targetId from request parameters
		const { targetId } = req.params;

		const messages = await Message.find({
			$or: [
				{ sender: userId, recipient: targetId },
				{ sender: targetId, recipient: userId },
			],
		})
			.sort({ createdAt: 1 })
			.populate("sender", "username")
			.populate("recipient", "username");
		res.status(200).json({
			success: true,
			data: messages,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: "Something went wrong." });
	}
};


// Get unique users the current user has chatted with
export const getRecentChatUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .sort({ updatedAt: -1 })
      .populate("sender", "username avatarUrl avatarSeed avatarBgColor")
      .populate("recipient", "username avatarUrl avatarSeed avatarBgColor");

    const userMap = new Map();

    messages.forEach((msg) => {
      // Ensure sender & recipient exist to avoid null errors
      if (!msg.sender || !msg.recipient) return;

      const otherUser =
        String(msg.sender._id) === userId ? msg.recipient : msg.sender;

      if (otherUser && !userMap.has(otherUser._id.toString())) {
        userMap.set(otherUser._id.toString(), otherUser);
      }
    });

    const uniqueUsers = Array.from(userMap.values());

    res.status(200).json({
      success: true,
      data: uniqueUsers,
    });

  } catch (error) {
    console.error("Error in getRecentChatUsers:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch recent chat users.",
    });
  }
};
