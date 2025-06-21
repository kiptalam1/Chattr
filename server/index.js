import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import passport, { configurePassport } from "./configs/passport.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

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
		origin: ["http://localhost:5173", "https://your-vercel-app.vercel.app"],
		credentials: true,
	})
);
app.use(passport.initialize());
// routes;
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// http serer + socket.io;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: ["http://localhost:5173", "https://your-vercel-app.vercel.app"],
		methods: ["GET", "POST"],
		credentials: true,
	},
});


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
	console.log(`Socket connected: ${socket.id}`);

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
