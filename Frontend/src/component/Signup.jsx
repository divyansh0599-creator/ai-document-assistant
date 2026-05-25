import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../services/authServices";

const Signup = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await registerUser({
                username,
                email,
                password
            });

            navigate("/login");

        } catch (error) {
            console.error(error);
            alert("Signup failed",error);
        }
    };

    return (
        <div>
            <h1>Signup</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">
                    Signup
                </button>

            </form>
        </div>
    );
};

export default Signup;