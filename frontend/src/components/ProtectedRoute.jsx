// Import Navigate to redirect users to another route if needed
import { Navigate } from "react-router-dom";

// Import jwtDecode to read JWT payload (e.g., expiration time)
import { jwtDecode } from "jwt-decode";

// Import preconfigured Axios instance for API calls
import api from "../api";

// Import keys for tokens stored in localStorage
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

// Import React hooks for state and side effects
import { useState, useEffect } from "react";

// Component that protects a route so only authorized users can access it
function ProtectedRoute({ children }) {
    // Track whether the user is authorized:
    // null = still checking, true = authorized, false = not authorized
    const [isAuthorized, setIsAuthorized] = useState(null);

    // Run authorization check on component mount
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    // Refresh the access token using the refresh token if needed
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try {
            const res = await api.post("/api/token/refresh/", { refresh: refreshToken });

            if (res.status === 200) {
                // Store new access token and mark user as authorized
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    // Check whether the current access token is valid
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!token) {
            setIsAuthorized(false);
            return;
        }

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            // Token expired → try refreshing
            await refreshToken();
        } else {
            // Token still valid
            setIsAuthorized(true);
        }
    };

    // Show a loading message while authorization is being determined
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // If authorized, render children; otherwise redirect to /login
    return isAuthorized ? children : <Navigate to="/login" />;
}

// Export the component for use in route definitions
export default ProtectedRoute;
