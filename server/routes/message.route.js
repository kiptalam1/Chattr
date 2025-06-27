import { Router } from "express";
import {
	getMessages,
	getPrivateMessagesHistory,
	getRecentChatUsers,
} from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/v1/messages?roomId=global;
router.get("/", verifyToken, getMessages);
// GET /api/v1/messages/private/:targetId;
router.get("/private/:targetId", verifyToken, getPrivateMessagesHistory);
// GET /api/v1/messages/recent-chats;
router.get("/recent-chats", verifyToken, getRecentChatUsers);

export default router;
