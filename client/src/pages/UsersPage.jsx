import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import API from "../utils/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { user } = useAuth();

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await API.get("/api/v1/users");
				if (res.data.success === false) {
					setError(res.data.message || "Failed to fetch users");
				} else {
					setUsers(res.data.data.filter((u) => u._id !== user.id)); // Exclude current user
				}
			} catch (error) {
				if (import.meta.env.MODE === "development") {
					console.error("Error fetching users:", error);
				}
				setError(
					error.response?.data?.message ||
						"Failed to fetch chats due to server error"
				);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, [user.id]);

	// take current user to DM when a user in users is clicked;
	const navigate = useNavigate();

	const handleUserClick = (user) => {
		navigate(`/dm/${user._id}`, { state: { recipient: user, from: "/users" } });
	};

	if (loading) return <Spinner />;
	if (error)
		return <div className="text-center text-red-500 py-4">{error}</div>;
	if (users.length === 0)
		return (
			<div className="text-xs text-center text-gray-500 py-4">
				No recent chats yet.
			</div>
		);

	return (
		<div className="pb-[70px] scroll-smooth sm:px-8 md:px-16 lg:px-32 xl:px-64">
			<h2 className="text-[var(--color-primary)] text-xl font-bold text-center py-4 mb-2">
				Users
			</h2>
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
