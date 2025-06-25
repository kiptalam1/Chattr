// Layout.jsx
import NavBar from "./NavBar";

const Layout = ({ children }) => (
	<div>
		{children}
		<NavBar />
	</div>
);
export default Layout;
