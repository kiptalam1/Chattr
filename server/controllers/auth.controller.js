import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.model.js";

export async function registerUser(req, res) {
	try {
		const { username, email, password } = req.body;

		// check if user exists;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400).json({
				success: false,
				message: "User already exists !",
			});
			return; // Prevents double response
		}

		// else hash password and create user;
		const salt = 10;
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});

		await newUser.save();

		// Generate token;
		const token = jwt.sign(
			{
				id: newUser._id,
				email: newUser.email,
				role: newUser.role,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		const userData = {
			id: newUser._id,
			name: newUser.name,
			email: newUser.email,
			role: newUser.role,
		};

		res.status(201).json({
			success: true,
			message: "Registered successfully",
			data: {
				user: userData,
				token,
			},
		});
	} catch (error) {
		console.error("Registration error", error);
		res.status(500).json({
			success: false,
			message: "Registration failed !",
		});
	}
}
