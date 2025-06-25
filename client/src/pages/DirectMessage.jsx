import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { useAuth } from "../contexts/AuthContext";
import socket from "../utils/socket.js";
import API from "../utils/api.js";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
dayjs.extend(calendar);

const DirectMessage = () => {
	const { user } = useAuth();
	const { id } = useParams();
	const { state } = useLocation();

	const [recipient, setRecipient] = useState(state?.recipient || null);
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [typing, setTyping] = useState(false);
	const [showPicker, setShowPicker] = useState(false);
	const messagesEndRef = useRef(null);

	// Fetch recipient details if not passed from route
	useEffect(() => {
		if (!recipient) {
			API.get(`/api/v1/users/${id}`)
				.then((res) => setRecipient(res.data.data))
				.catch((err) =>
					console.error("Failed to fetch recipient:", err.message)
				);
		}
	}, [id, recipient]);

	// Fetch private messages
	useEffect(() => {
		if (!recipient) return;
		API.get(`/api/v1/messages/private/${recipient._id}`)
			.then((res) => setMessages(res.data.data))
			.catch((err) => console.error("Error fetching messages:", err.message));
	}, [recipient]);

	// Listen for incoming private messages & typing indicators
	useEffect(() => {
		socket.on("receive_private_message", (msg) => {
			if (
				msg.sender._id === recipient?._id ||
				msg.recipient === recipient?._id
			) {
				setMessages((prev) => [...prev, msg]);
			}
		});

		socket.on("user_typing_dm", ({ from }) => {
			if (from === recipient?._id) {
				setTyping(true);
				setTimeout(() => setTyping(false), 2000);
			}
		});

		return () => {
			socket.off("receive_private_message");
			socket.off("user_typing_dm");
		};
	}, [recipient]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (!message.trim()) return;

		socket.emit("send_private_message", {
			content: message,
			to: recipient._id,
		});
		setMessage("");
	};

	const handleTyping = () => {
		socket.emit("typing_dm", { to: recipient._id });
	};

	const onEmojiSelect = (emoji) => {
		setMessage((prev) => prev + emoji.native);
		setShowPicker(false);
	};

	const formatDay = (ts) =>
		dayjs(ts).calendar(null, {
			sameDay: "[Today]",
			lastDay: "[Yesterday]",
			lastWeek: "dddd",
			sameElse: "MMM D, YYYY",
		});

	if (!recipient) {
		return <Spinner />;
	}

	return (
		<div className="flex flex-col h-screen px-4 py-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 bg-[var(--color-bg)] text-[var(--color-text)] pb-[70px]">
			<h2 className="text-xl font-bold text-[var(--color-primary)] mb-2">
				Chat with {recipient.username}
			</h2>

			<div className="flex-1 overflow-y-auto space-y-3">
				{messages.map((msg, i) => {
					const isOwn = msg.sender._id === user.id;
					const prev = messages[i - 1];
					const newDay =
						!prev ||
						dayjs(prev.createdAt).format("YYYY-MM-DD") !==
							dayjs(msg.createdAt).format("YYYY-MM-DD");

					return (
						<React.Fragment key={msg._id}>
							{newDay && (
								<div className="w-fit mx-auto px-4 py-0 rounded-full bg-[var(--color-bg-alt)] text-[12px] text-[var(--color-muted)] my-3">
									{formatDay(msg.createdAt)}
								</div>
							)}

							<div
								className={`w-fit max-w-[80%] sm:max-w-[65%] md:max-w-[55%] break-words whitespace-pre-wrap p-3 rounded-2xl ${
									isOwn
										? "ml-auto bg-[var(--color-message-own)]"
										: "mr-auto bg-[var(--color-message-other)]"
								}`}>
								<div className="text-sm">{msg.content}</div>
								<div className="flex justify-end mt-1 text-[10px] text-[var(--color-muted)]">
									{dayjs(msg.createdAt).format("h:mm A")}
								</div>
							</div>
						</React.Fragment>
					);
				})}
				<div ref={messagesEndRef} />
			</div>

			{typing && (
				<div className="text-[10px] text-[var(--color-muted)] mb-2">
					{recipient.username} is typing…
				</div>
			)}

			<form
				onSubmit={handleSendMessage}
				className="sticky bottom-0 bg-[var(--color-bg)] p-2 flex gap-2 z-10">
				{showPicker && (
					<div className="absolute bottom-16 right-4 z-50 cursor-pointer">
						<Picker data={data} onEmojiSelect={onEmojiSelect} theme="light" />
					</div>
				)}
				<button type="button" onClick={() => setShowPicker((p) => !p)}>
					😊
				</button>
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onInput={handleTyping}
					placeholder="Type..."
					className="flex-1 px-4 py-2 rounded-2xl border bg-transparent"
				/>
				<Button type="submit" variant="secondary">
					Send
				</Button>
			</form>
		</div>
	);
};

export default DirectMessage;
