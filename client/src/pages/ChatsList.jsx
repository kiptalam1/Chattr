import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api.js";
import Spinner from "../components/Spinner.jsx";

const ChatsList = () => {
	const [chatList, setChatList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPreviousChats = async () => {
			try {
				const res = await API.get("/api/v1/messages/recent-chats");

				if (res.data.success === false) {
					setError(res.data.message || "Failed to fetch chats");
				} else {
					setChatList(res.data.data);
				}
			} catch (err) {
				if (import.meta.env.MODE === "development") {
					console.error("Error fetching chats", err);
				}
				setError(
					err.response?.data?.message ||
						"Failed to fetch chats due to server error"
				);
			} finally {
				setLoading(false);
			}
		};
		fetchPreviousChats();
	}, []);

	const handleChatClick = (chat) => {
		navigate(`/dm/${chat._id}`, {
			state: { recipient: chat, from: "/messages" },
		});
	};

	if (loading) return <Spinner />;
	if (error)
		return <div className="text-center text-red-500 py-4">{error}</div>;
	if (chatList.length === 0)
		return (
			<div className="text-xs text-center text-gray-500 py-4">
				No recent chats yet.
			</div>
		);

	return (
		<div className="pb-[70px] scroll-smooth sm:px-8 md:px-16 lg:px-32 xl:px-64">
			<h2 className="text-[var(--color-primary)] text-xl font-bold text-center py-4 mb-2">
				Chats
			</h2>
			{chatList.map((c) => (
				<div
					key={c._id}
					onClick={() => handleChatClick(c)}
					className="flex items-center px-4 py-2 hover:bg-[var(--color-bg-alt)] hover:shadow-sm cursor-pointer hover:rounded-lg transition-all duration-200">
					<img
						src={
							c.avatarUrl ||
							`https://api.dicebear.com/7.x/adventurer/svg?seed=${c.avatarSeed}&radius=50&backgroundColor=${c.avatarBgColor}&backgroundType=gradientLinear`
						}
						alt={c.username}
						className="w-10 h-10 rounded-full mr-2"
					/>
					<span className="font-bold antialiased text-base">{c.username}</span>
				</div>
			))}
		</div>
	);
};

export default ChatsList;
