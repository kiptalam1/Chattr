import { clsx } from "clsx";

const base =
	"px-4 py-2 rounded-xl transition-colors duration-500 ease-in-out font-[var(--font-heading)] cursor-pointer";

const variants = {
	primary: "bg-[var(--color-primary)] text-white hover:opacity-90",
	secondary: "bg-[var(--color-accent)] text-white hover:opacity-90",
	ghost:
		"bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-bg-alt)]",
	danger: "bg-red-600 text-white hover:bg-red-700",
};

const Button = ({
	children,
	variant = "primary",
	className = "",
	type = "button",
	...props
}) => {
	return (
		<button
			type={type}
			className={clsx(base, variants[variant], className)}
			{...props}>
			{children}
		</button>
	);
};

export default Button;
