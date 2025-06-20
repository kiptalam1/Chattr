import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		res.status(401).json({
			success: false,
			message: "Please login to access this resource.",
		});
	}
	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		console.error("Error verifying token", error);
		res.status(401).json({
			success: false,
			message: "Your session has expired. Please log in again.",
		});
	}
}
