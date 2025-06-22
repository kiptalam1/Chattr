// src/components/Spinner.jsx
const Spinner = () => {
	return (
		<div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)]">
			<div className="w-10 h-10 border-4 border-t-transparent border-[var(--color-accent)] rounded-full animate-spin"></div>
		</div>
	);
};

export default Spinner;
