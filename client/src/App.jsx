import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import GlobalChat from "./pages/GlobalChat";
import NotFoundPage from "./pages/NotFoundPage";
import DirectMessage from "./pages/DirectMessage";
import UsersPage from "./pages/UsersPage";
import MyProfile from "./pages/MyProfile";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/auth/login" element={<LoginPage />} />
				<Route path="/auth/register" element={<RegisterPage />} />
				<Route
					path="/chat"
					element={
						<PrivateRoute>
							<Layout>
								<GlobalChat />
							</Layout>
						</PrivateRoute>
					}
				/>
				<Route
					path="/dm/:id"
					element={
						<PrivateRoute>
							<Layout>
								<DirectMessage />
							</Layout>
						</PrivateRoute>
					}
				/>
				<Route
					path="/users"
					element={
						<PrivateRoute>
							<Layout>
								<UsersPage />
							</Layout>
						</PrivateRoute>
					}
				/>
				<Route
					path="/profile-me"
					element={
						<PrivateRoute>
							<Layout>
								<MyProfile />
							</Layout>
						</PrivateRoute>
					}
				/>
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</>
	);
}

export default App;
