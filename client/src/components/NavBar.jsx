import React from "react";
import { PiUserCircleDuotone } from "react-icons/pi";
// import { IoChatbubblesOutline } from "react-icons/io5";
// import { PiGlobeDuotone } from "react-icons/pi";
import { PiGlobeLight } from "react-icons/pi";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { PiChatCircleDotsLight } from "react-icons/pi";
import { NavLink } from "react-router-dom";

const NavBar = () => {
	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg)] shadow-md p-4 flex justify-around border-t border-[var(--color-border)]">
			<NavLink
				to="/chat"
				className={({ isActive }) =>
					`transition-colors w-6 h-6 ${
						isActive
							? "text-[var(--color-primary)]"
							: "text-[var(--color-text)] hover:text-[var(--color-muted)]"
					}`
				}>
				<PiGlobeLight className="w-6 h-6" />
			</NavLink>

			<NavLink
				to="/users"
				className={({ isActive }) =>
					`transition-colors w-6 h-6 ${
						isActive
							? "text-[var(--color-primary)]"
							: "text-[var(--color-text)] hover:text-[var(--color-muted)]"
					}`
				}>
				<PiUsersThreeDuotone className="w-6 h-6" />
			</NavLink>
			<NavLink
				to="/messages"
				className={({ isActive }) =>
					`transition-colors w-6 h-6 ${
						isActive
							? "text-[var(--color-primary)]"
							: "text-[var(--color-text)] hover:text-[var(--color-muted)]"
					}`
				}>
				<PiChatCircleDotsLight className="w-6 h-6" />
			</NavLink>
			<NavLink
				to="/profile-me"
				className={({ isActive }) =>
					`transition-colors w-6 h-6 ${
						isActive
							? "text-[var(--color-primary)]"
							: "text-[var(--color-text)] hover:text-[var(--color-muted)]"
					}`
				}>
				<PiUserCircleDuotone className="w-6 h-6" />
			</NavLink>
		</nav>
	);
};

export default NavBar;
