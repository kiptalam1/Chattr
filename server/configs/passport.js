import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User.model.js";

export function configurePassport() {
	passport.use(
		new LocalStrategy(
			{ usernameField: "email" },
			async (email, password, done) => {
				try {
					// find user in the database;
					const user = await User.findOne({ email }).select("+password");
					if (!user) {
						return done(null, false, { message: "User not found" });
					}
					//if found check if password is correct;
					const isPasswordMatch = await bcrypt.compare(password, user.password);
					if (!isPasswordMatch) {
						return done(null, false, { message: "Incorrect password !" });
					}
					// else user is found;
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
}

export default passport;
