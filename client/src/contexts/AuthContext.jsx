// AuthContext to manage JWT & user state
import { useContext, createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import socket from "../utils/socket.js";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	const [isAuthReady, setIsAuthReady] = useState(false);

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			try {
				const decoded = jwtDecode(storedToken);
				const isExpired = decoded.exp * 1000 < Date.now();

				if (!isExpired) {
					setToken(storedToken);
					setUser(decoded);

					// 🔁 reconnect socket after reload
					socket.auth = { token: storedToken };
					socket.connect();
				} else {
					localStorage.removeItem("token");
				}
			} catch (error) {
				if (import.meta.env.MODE === "development") {
					console.error("Invalid token", error);
				}
				localStorage.removeItem("token");
			}
		}
		setIsAuthReady(true); // ✅ mark auth as checked
	}, []);

	const login = (token) => {
		const decoded = jwtDecode(token);
		setToken(token);
		setUser(decoded);
		localStorage.setItem("token", token);

		// 🟢 Connect socket after login
		socket.auth = { token };
		socket.connect();
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem("token");

		// 🔴 Disconnect socket on logout
		socket.disconnect();
	};

	return (
		<AuthContext.Provider value={{ token, user, login, logout, isAuthReady }}>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
