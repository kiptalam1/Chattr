import React, { useEffect, useState } from "react";
import { PiMoonLight } from "react-icons/pi";
import { PiSunLight } from "react-icons/pi";
import { PiSunDim } from "react-icons/pi";
import { PiMoon } from "react-icons/pi";
import { PiUserCircleDuotone } from "react-icons/pi";
// import { IoChatbubblesOutline } from "react-icons/io5";
// import { PiGlobeDuotone } from "react-icons/pi";
import { PiGlobeLight } from "react-icons/pi";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { PiChatCircleDotsLight } from "react-icons/pi";
import { PiSignOutFill } from "react-icons/pi";
import { NavLink } from "react-router-dom";

const NavBar = () => {
	const [darkMode, setDarkMode] = useState(
		localStorage.getItem("theme") === "dark"
	);

	useEffect(() => {
		const theme = darkMode ? "dark" : "light";
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [darkMode]);

	const toggleButtonClasses = `w-6 h-6 transition-colors cursor-pointer ${
		darkMode
			? "text-amber-400 hover:text-amber-200"
			: "text-amber-400 hover:text-amber-300"
	}`;

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg)] shadow-md p-4 flex justify-around border-t border-[var(--color-border)]">
			<button
				onClick={() => setDarkMode((prev) => !prev)}
				className={toggleButtonClasses}
				aria-label="Toggle dark mode">
				{darkMode ? (
					<PiSunDim className="w-6 h-6" />
				) : (
					<PiMoonLight className="w-6 h-6" />
				)}
			</button>
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

			<NavLink
				to="/auth/logout"
				className={({ isActive }) =>
					`transition-colors w-6 h-6 ${
						isActive
							? "text-[var(--color-primary)]"
							: "text-[var(--color-text)] hover:text-red-100"
					}`
				}>
				<PiSignOutFill className="w-6 h-6 text-red-600" />
			</NavLink>
		</nav>
	);
};

export default NavBar;
