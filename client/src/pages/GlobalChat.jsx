import React, { useEffect, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import socket from "../utils/socket.js";
import API from "../utils/api.js";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
dayjs.extend(calendar);

const GlobalChat = () => {
	const { user } = useAuth();
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState("");
	const [typingUser, setTypingUser] = useState("");
	const [showPicker, setShowPicker] = useState(false);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		API.get("/api/v1/messages?roomId=global")
			.then((res) => setMessages(res.data.data))
			.catch(console.error);

		socket.on("receive_message", (msg) => {
			setMessages((prev) => [...prev, msg]);
		});

		socket.on("user_typing", ({ user }) => {
			setTypingUser(user);
			setTimeout(() => setTypingUser(""), 2000);
		});

		socket.on("update_reactions", ({ messageId, reactions }) => {
			setMessages((prev) =>
				prev.map((m) => (m._id === messageId ? { ...m, reactions } : m))
			);
		});

		return () => {
			socket.off("receive_message");
			socket.off("user_typing");
			socket.off("update_reactions");
		};
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = (e) => {
		e.preventDefault();
		if (!message.trim()) return;
		socket.emit("send_message", { content: message, roomId: "global" });
		setMessage("");
		socket.emit("message_read", { messageId: null });
	};

	const onEmojiSelect = (emoji) => {
		setMessage((prev) => prev + emoji.native);
		setShowPicker(false);
	};

	const handleReaction = (msgId, emoji) => {
		socket.emit("message_reaction", { messageId: msgId, emoji });
	};

	const onTyping = () => socket.emit("typing", { roomId: "global", user });

	const formatDay = (ts) =>
		dayjs(ts).calendar(null, {
			sameDay: "[Today]",
			lastDay: "[Yesterday]",
			lastWeek: "dddd",
			sameElse: "MMM D, YYYY",
		});

	return (
		<div className="flex flex-col h-screen px-4 py-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 bg-[var(--color-bg)] text-[var(--color-text)] pb-[70px]">
			<h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2 text-center">
				Global Chat
			</h2>

			<div className="flex-1 overflow-y-auto space-y-3">
				{messages.map((msg, i) => {
					if (!msg.sender) return null;
					const isOwn = msg.sender._id === user.id;

					const prev = messages[i - 1];
					const newDay =
						!prev ||
						dayjs(prev.createdAt).format("YYYY-MM-DD") !==
							dayjs(msg.createdAt).format("YYYY-MM-DD");
					const isSameSender = prev && prev.sender?._id === msg.sender?._id;

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
								{!isSameSender && (
									<div
										className={`text-xs font-semibold mb-1 italic ${
											isOwn
												? "text-[var(--color-primary)]"
												: "text-[var(--color-accent)]"
										}`}>
										~{msg.sender.username}
									</div>
								)}

								<div className="text-sm">{msg.content}</div>
								<div className="flex items-center gap-2 mt-1 text-[10px] text-[var(--color-muted)]">
									<span>{dayjs(msg.createdAt).format("h:mm A")}</span>
									{msg.readBy.length > 1 && (
										<span>👀 {msg.readBy.length - 1}</span>
									)}
									<span className="flex gap-1">
										{msg.reactions?.map((r, idx) => (
											<span key={idx}>{r.emoji}</span>
										))}
									</span>
								</div>
								<div className="flex gap-2 mt-1">
									{["👍", "😂", "❤️"].map((emoji) => (
										<button
											key={emoji}
											onClick={() => handleReaction(msg._id, emoji)}
											className="text-xs">
											{emoji}
										</button>
									))}
								</div>
							</div>
						</React.Fragment>
					);
				})}
				<div ref={messagesEndRef} />
			</div>

			{typingUser && (
				<div className="text-[10px] text-[var(--color-muted)] mb-2">
					{typingUser} is typing…
				</div>
			)}

			<form
				onSubmit={sendMessage}
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
					onInput={onTyping}
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

export default GlobalChat;
