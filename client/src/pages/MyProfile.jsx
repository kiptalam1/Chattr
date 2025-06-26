import React, { useEffect, useState } from "react";
import API from "../utils/api.js";
import Spinner from "../components/Spinner.jsx";

const MyProfile = () => {
	const [myProfile, setMyProfile] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchMyProfile = async () => {
			try {
				const res = await API.get("/api/v1/users/me");
				setMyProfile(res.data.data);
			} catch (error) {
				if (import.meta.env.MODE === "development") {
					console.error("Error fetching my profile", error);
				}
				setError("Failed to load profile");
			}
		};
		fetchMyProfile();
	}, []);

	if (error) {
		return <div className="text-center text-red-500 py-4">{error}</div>;
	}

	if (!myProfile) return <Spinner />;

	const avatarSrc =
		myProfile.avatarUrl ||
		`https://api.dicebear.com/7.x/adventurer/svg?seed=${myProfile.avatarSeed}&radius=50&backgroundColor=${myProfile.avatarBgColor}&backgroundType=gradientLinear`;

	return (
		<div className="flex flex-col h-screen px-4 py-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 bg-[var(--color-bg)] text-[var(--color-text)] pb-[70px]">
			<h2 className="text-[var(--color-primary)] text-xl font-bold text-center py-4 mb-4 sm:mb-8 md:mb-12">
				My Profile
			</h2>

			<div className="flex flex-col gap-4 items-center justify-center">
				<img
					src={avatarSrc}
					alt="avatar"
					className="w-28 h-28 sm:size-32 md:size-36 rounded-full"
				/>
				<span className="font-bold text-lg sm:text-xl ">
					{myProfile.username}
				</span>
				<span className="text-sm sm:text-base text-[var(--color-muted)]">
					{myProfile.email}
				</span>
				<span className="text-xs sm:text-sm uppercase text-[var(--color-accent)]">
					{myProfile.role}
				</span>
			</div>
		</div>
	);
};

export default MyProfile;
