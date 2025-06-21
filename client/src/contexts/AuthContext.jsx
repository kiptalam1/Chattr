// AuthContext to manage JWT & user state
import { useContext, createContext, useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			try {
				const decoded = jwtDecode(storedToken);
				if (decoded.exp * 1000 >= Date.now()) {
					setToken(storedToken);
					setUser(decoded); // decoded = { id, email, role, iat, exp }
				} else {
					localStorage.removeItem("token");
				}
			} catch (error) {
				if (import.meta.env.MODE === "development") {
					console.error("Token error", error);
				}
				localStorage.removeItem("token");
			}
		}
	}, []);

	const login = ({ token }) => {
		const decoded = jwtDecode(token);
		setToken(token);
		setUser(decoded);
		localStorage.setItem("token", token);
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ token, user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
