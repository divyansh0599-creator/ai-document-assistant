import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const INACTIVITY_TIMEOUT = 60 * 60 * 1000;

const ACTIVITY_EVENTS = [
    "click",
    "keydown",
    "mousedown",
    "mousemove",
    "scroll",
    "touchstart"
];

const getTokenPayload = (token) => {

    try {

        const payload = token.split(".")[1];
        const normalizedPayload = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(Math.ceil(payload.length / 4) * 4, "=");

        return JSON.parse(atob(normalizedPayload));

    } catch {

        return null;
    }
};

const isTokenExpired = (token) => {

    const payload = getTokenPayload(token);

    if (!payload?.exp) {
        return true;
    }

    return Date.now() >= payload.exp * 1000;
};

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {

        localStorage.removeItem("token");

        setUser(null);

        navigate("/auth", { replace: true });

    }, [navigate]);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token && !isTokenExpired(token)) {
            setUser({ token });
        } else {
            localStorage.removeItem("token");
        }

        setLoading(false);

    }, []);

    useEffect(() => {

        if (!user?.token) {
            return;
        }

        let timeoutId;

        const resetInactivityTimer = () => {

            window.clearTimeout(timeoutId);

            timeoutId = window.setTimeout(() => {
                logout();
            }, INACTIVITY_TIMEOUT);
        };

        ACTIVITY_EVENTS.forEach((eventName) => {
            window.addEventListener(eventName, resetInactivityTimer);
        });

        resetInactivityTimer();

        return () => {

            window.clearTimeout(timeoutId);

            ACTIVITY_EVENTS.forEach((eventName) => {
                window.removeEventListener(eventName, resetInactivityTimer);
            });
        };

    }, [logout, user?.token]);

    useEffect(() => {

        const handleForcedLogout = () => {
            logout();
        };

        window.addEventListener("auth:logout", handleForcedLogout);

        return () => {
            window.removeEventListener("auth:logout", handleForcedLogout);
        };

    }, [logout]);

    const login = (token) => {

        if (isTokenExpired(token)) {
            logout();
            return;
        }

        localStorage.setItem("token", token);

        setUser({ token });
    };

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};
