import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import API from "../utils/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const LoginPage = () => {
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const [success, setSuccess] = useState(null);
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const navigate = useNavigate();
	const { login } = useAuth();
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setMessage("");
		setLoading(true);

		try {
			const { email, password } = form;

			const res = await API.post("/auth/login", { email, password });

			if (res?.data?.success) {
				setSuccess(true);
				setMessage(res.data.message);

				// Optional: if using useAuth()
				login(res.data.data); // save token/user globally

				setTimeout(() => {
					setMessage("");
					navigate("/dashboard");
				}, 1500);
			} else {
				setSuccess(false);
				setError(res.data?.message || "Unexpected response.");
			}
		} catch (error) {
			if (import.meta.env.MODE === "development") {
				console.error(
					"Login error:",
					error.response?.data?.message || error.message
				);
			}
			setSuccess(false);
			setError(error.response?.data?.message || "Login failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="box-border min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4 text-center ">
			<div className="w-full max-w-md bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-2xl p-6 shadow-md">
				<h2 className="text-2xl sm:text-3xl font-[var(--font-heading)] text-[var(--color-primary)] text-center mb-4">
					Login
				</h2>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<input
						type="email"
						onChange={handleChange}
						value={form.email}
						name="email"
						placeholder="Enter your email"
						className=" px-4 py-2 border border-[var(--color-border)] rounded-lg bg-transparent font-[var(--font-body)] text-[var(--color-text)] "
					/>
					<input
						type="password"
						onChange={handleChange}
						value={form.password}
						name="password"
						placeholder="Enter your password"
						className=" px-4 py-2 border border-[var(--color-border)] rounded-lg bg-transparent font-[var(--font-body)] text-[var(--color-text)] "
					/>

					{(error || message) && (
						<p
							className={`text-sm px-4 py-2 border rounded animate-fade-in ${
								success
									? "text-green-700 bg-green-100 border-green-300"
									: "text-red-700 bg-red-100 border-red-300"
							}`}>
							{error || message}
						</p>
					)}

					<Button type="submit" variant="primary" disabled={loading}>
						{loading ? "Processing..." : "Login"}
					</Button>

					<p className="text-sm text-[var(--color-muted)] text-center">
						Don't have an account yet?{" "}
						<span
							onClick={() => navigate("/auth/register")}
							className="text-[var(--color-accent)] cursor-pointer underline">
							Sign up
						</span>
					</p>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
