import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
	const { token } = useAuth();
	return token ? children : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
