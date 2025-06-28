import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import passport, { configurePassport } from "./configs/passport.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import Message from "./models/Message.model.js";
import User from "./models/User.model.js";

// connect to database;
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("MongoDB connected !"))
	.catch((error) => console.log("Error connecting to mongo DB !", error));

const app = express();

// configure passport-local strategy;
configurePassport();
// middleware;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: ["http://localhost:5173", "https://chattr-roan.vercel.app"],
		credentials: true,
	})
);
app.use(passport.initialize());
// routes;
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/messages", messageRoutes);
// http serer + socket.io;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: ["http://localhost:5173", "https://chattr-roan.vercel.app"],
		methods: ["GET", "POST"],
		credentials: true,
	},
});

// User → socket.id map
const onlineUsers = new Map();

// 🔐 middleware to verify token
io.use((socket, next) => {
	const token = socket.handshake.auth?.token;
	if (!token) {
		return next(new Error("Authentication error"));
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		socket.user = decoded; // attach user data to socket
		next();
	} catch (err) {
		next(new Error("Invalid token"));
	}
});

io.on("connection", (socket) => {
	const userId = socket.user.id;

	console.log("Socket connected:", socket.id);
	onlineUsers.set(userId, socket.id);
	socket.join(userId); // Join room named after userId for DMs

	// ✏️ Typing Indicator
	socket.on("typing", ({ roomId, user }) => {
		socket.broadcast.emit("user_typing", { user });
	});

	// 📩 Send Message
	socket.on("send_message", async ({ content, roomId }) => {
		const msg = await Message.create({
			sender: socket.user.id,
			content,
			roomId,
			readBy: [socket.user.id],
		});
		const fullMsg = await msg.populate("sender", "username");
		io.emit("receive_message", fullMsg);
	});

	// ✅ Read Receipts
	socket.on("message_read", async ({ messageId }) => {
		if (!messageId) return;
		await Message.findByIdAndUpdate(messageId, {
			$addToSet: { readBy: socket.user.id },
		});
	});

	// 💬 React to message
	socket.on("message_reaction", async ({ messageId, emoji }) => {
		const msg = await Message.findById(messageId);
		if (!msg) return;

		// Remove existing reaction by this user
		msg.reactions = msg.reactions.filter(
			(r) => String(r.user) !== socket.user.id
		);

		msg.reactions.push({ user: socket.user.id, emoji });
		await msg.save();

		const updated = await msg.populate("reactions.user", "username");
		io.emit("update_reactions", {
			messageId,
			reactions: updated.reactions,
		});
	});

	// 🔒 Private Messages;
	socket.on("send_private_message", async ({ to, content }) => {
		if (!to || !content) return;
		const msg = await Message.create({
			sender: socket.user.id,
			recipient: to,
			content,
			readBy: [socket.user.id],
		});
		const fullMsg = await msg.populate("sender", "username");
		io.to(to).emit("receive_private_message", fullMsg);
		io.to(socket.user.id).emit("receive_private_message", fullMsg); // send back to sender for confirmation & better UX;
	});

	// 🟣 DMs - Typing
	socket.on("typing_dm", ({ to }) => {
		io.to(to).emit("user_typing_dm", { from: userId });
	});

	socket.on("disconnect", () => {
		console.log("Socket disconnected:", socket.id);
	});
});

// listen to app;
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
	console.log(`Server + Socket.IO running on port ${PORT}`);
});
// app.listen(PORT, () => console.log(`It's running my guy`));
export { io };
