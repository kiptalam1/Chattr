import React from "react";
import { CgProfile } from "react-icons/cg";
import { IoChatbubblesOutline } from "react-icons/io5";
import { PiUsersThreeBold } from "react-icons/pi";
import { NavLink } from "react-router-dom";

const NavBar = () => {
	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg)] shadow-md p-4 flex justify-around border-t border-[var(--color-border)]">
			<NavLink
				to="/chat"
				className="text-[var(--color-text)] hover:text-[var(--color-text-hover)] transition-colors">
				<IoChatbubblesOutline className="w-6 h-6" />
			</NavLink>
			<NavLink
				to="/users"
				className="text-[var(--color-text)] hover:text-[var(--color-text-hover)] transition-colors">
				<PiUsersThreeBold className="w-6 h-6" />
			</NavLink>
			<NavLink
				to="/profile"
				className="text-[var(--color-text)] hover:text-[var(--color-text-hover)] transition-colors">
				<CgProfile className="w-6 h-6" />
			</NavLink>
		</nav>
	);
};

export default NavBar;
