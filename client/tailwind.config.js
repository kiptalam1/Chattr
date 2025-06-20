export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				bg: "var(--color-bg)",
				bgAlt: "var(--color-bg-alt)",
				text: "var(--color-text)",
				primary: "var(--color-primary)",
				accent: "var(--color-accent)",
				muted: "var(--color-muted)",
				border: "var(--color-border)",
				msgOwn: "var(--color-message-own)",
				msgOther: "var(--color-message-other)",
			},
			fontFamily: {
				body: ["var(--font-body)"],
				heading: ["var(--font-heading)"],
			},
		},
	},
};
