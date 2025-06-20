import express from "express";
import mongoose from "mongoose";
import cors from "cors";
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


// listen to app;
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`It's running my guy`));
