import { Routes, Route } from "react-router-dom";


import Login from "../component/Login";
import Signup from "../component/Signup";
import Chat from "../component/chat";

import ProtectedRoute from "../component/ProtectedRoutes";

const AppRoutes = () => {

    return (
        <Routes>

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

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