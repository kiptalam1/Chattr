import { Router } from "express";
import { getMessages } from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/v1/messages?roomId=global;
router.get("/", verifyToken, getMessages);

export default router;
