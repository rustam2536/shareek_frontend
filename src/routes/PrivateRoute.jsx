import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

const PrivateRoute = ({ children }) => {
    const { token, isAuthReady } = useAuth();
    const location = useLocation();

    if (!isAuthReady) {
        // Optional: loading spinner
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
