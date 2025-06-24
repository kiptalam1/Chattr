import { Router } from "express";
import { getUserProfile, getAllUsers } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = Router();

// user routes;
router.get("/me", verifyToken, getUserProfile);
// GET all users;
router.get("/", verifyToken, getAllUsers);

export default router;
