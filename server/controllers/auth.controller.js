import jwt from "jsonwebtoken";
import passport from "passport";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.model.js";


const bgColors = ["ffd5ec", "d1f4ff", "ffe2b0", "e0e4ff", "dcffd1", "fff2d8"];
export async function registerUser(req, res) {
	try {
		const { username, email, password } = req.body;

		// check if user exists;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400).json({
				success: false,
				message: "An account with that email already exists",
			});
			return; // Prevents double response
		}

		// else hash password and create user;
		const salt = 10;
		const hashedPassword = await bcrypt.hash(password, salt);
		const avatarBgColor = bgColors[Math.floor(Math.random() * bgColors.length)];

		const newUser = new User({
			username,
			email,
			password: hashedPassword,
			avatarSeed: username,
			avatarBgColor,
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
			username: newUser.username,
			email: newUser.email,
			role: newUser.role,
		};

		res.status(201).json({
			success: true,
			message: "Account created successfully.",
			data: {
				user: userData,
				token,
			},
		});
	} catch (error) {
		console.error("Registration error", error);
		res.status(500).json({
			success: false,
			message: "Something went wrong. Please try again later.",
		});
	}
}

// login user logic;
export function loginUser(req, res, next) {
	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err) return next(err);
		
		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid email or password",
			})
		}

		// generate jwt token if there is a user;
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			token,
			data: {
				user: {
					id: user._id,
					username: user.username,
					email: user.email,
				},
			},
		});
	})(req, res, next)
};