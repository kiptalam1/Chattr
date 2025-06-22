import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "./Spinner";

const PrivateRoute = ({ children }) => {
	const { token, isAuthReady } = useAuth();

	if (!isAuthReady) return <Spinner />; // or loading spinner

	return token ? children : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
