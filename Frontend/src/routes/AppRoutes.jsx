import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "../component/Auth";

import Chat from "../component/chat";

import ProtectedRoute from "../component/ProtectedRoutes";

const AppRoutes = () => {

    return (
         <Routes>

            <Route
                path="/"
                element={<Navigate to="/auth" />}
            />

            <Route
                path="/auth"
                element={<Auth />}
            />

            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <Chat />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
};

export default AppRoutes;