import User from "../models/User.model.js";


export async function getAllUsers(req, res) {
	try {
		const users = await User.find({}, "_id username avatar")
		res.status(200).json({
			success: true,
			data:  users ,
		});
	} catch (error) {
		console.error("Users fetch error", error);
		res.json({
			success: false,
			message: "Server error.",
		});
	}
};

export async function getUserProfile(req, res) {
	try {
		// find the user from the database;
		const user = await User.findById(req.user.id).select("username email role");
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}

		// else if user is present;
		res.status(200).json({
			success: true,
			data: { user },
		});
	} catch (error) {
		console.error("Profile fetch error", error);
		res.json({
			success: false,
			message: "Server error.",
		});
	}
}
