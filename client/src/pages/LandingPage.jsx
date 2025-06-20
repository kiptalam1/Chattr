import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
const LandingPage = () => {
	const navigate = useNavigate();
	return (
		<div className="box-border min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center gap-6 px-4 text-center">
			<h1 className=" font-[var(--font-heading)] text-4xl sm:text-5xl text-[var(--color-primary)] antialiased mb-2 tracking-tight ">
				Chattr
			</h1>
			<p className="text-base text-[var(--color-muted)] italic font-[var(--font-body)] mb-4 max-w-md ">
				Chat instantly. One app for DMs, groups, and global talk.
			</p>
			<div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full max-w-xs mx-auto ">
				<Button
					className="w-full sm:w-32 "
					variant="ghost"
					onClick={() => navigate("/login")}>
					Login
				</Button>

				<Button
					className="w-full sm:w-32 "
					variant="primary"
					onClick={() => navigate("/register")}>
					Register
				</Button>
			</div>
		</div>
	);
};

export default LandingPage;
