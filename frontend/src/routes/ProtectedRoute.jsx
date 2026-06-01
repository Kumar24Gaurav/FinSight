import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {

    const token = localStorage.getItem("token");

    const storedUser = localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;

    // Not logged in
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Logged in but wrong role
    if (
        allowedRoles && !allowedRoles.includes(user?.role)
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        )
    }

    return children;
}

export default ProtectedRoute;