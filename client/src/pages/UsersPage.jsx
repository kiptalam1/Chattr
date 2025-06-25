import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import API from "../utils/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const { user } = useAuth();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await API.get("/api/v1/users");
				setUsers(res.data.data.filter((u) => u._id !== user.id)); // Exclude current user
			} catch (error) {
				if (import.meta.env.MODE === "development") {
					console.error("Error fetching users:", error);
				}
			}
		};
		fetchUsers();
	}, [user.id]);

	// take current user to DM when a user in users is clicked;
	const navigate = useNavigate();

	const handleUserClick = (user) => {
		navigate(`/dm/${user._id}`, { state: { recipient: user } });
	};

	return (
		<div className="pb-[70px] scroll-smooth">
			{users.map((u) => (
				<div
					onClick={() => handleUserClick(u)}
					key={u._id}
					className="flex items-center px-4 py-2 hover:bg-[var(--color-bg-alt)] hover:shadow-sm cursor-pointer hover:rounded-lg transition-all duration-200">
					<img
						src={
							u.avatarUrl ||
							`https://api.dicebear.com/7.x/adventurer/svg?seed=${u.avatarSeed}&radius=50&backgroundColor=${u.avatarBgColor}&backgroundType=gradientLinear`
						}
						alt={u.username}
						className="w-10 h-10 rounded-full mr-2"
					/>
					<span className="font-bold antialiased text-base font-(family-name:[var(--font-body)]">
						{u.username}
					</span>
				</div>
			))}
		</div>
	);
};

export default UsersPage;
