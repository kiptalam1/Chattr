import { Router } from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = Router();

// user routes;
router.get("/me", verifyToken, getUserProfile);

export default router;
