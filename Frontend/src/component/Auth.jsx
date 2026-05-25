import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser, registerUser } from "../services/authServices";
import { AuthContext } from "../context/AuthContext";

const Auth = () => {

    const [isLogin, setIsLogin] = useState(true);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            if (isLogin) {

                const response = await loginUser({
                    email,
                    password
                });

                login(response.access_token);

                navigate("/chat");

            } else {

                await registerUser({
                    username,
                    email,
                    password
                });

                setIsLogin(true);
            }

        } catch (error) {

            setError(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex bg-black text-white">

            {/* LEFT SECTION */}

            <div className="hidden lg:flex w-1/2 flex-col justify-center px-20 bg-gradient-to-br from-purple-900 via-black to-blue-900">

                <h1 className="text-5xl font-bold mb-6">
                    AI Document Assistant
                </h1>

                <p className="text-lg text-gray-300 leading-8">
                    Upload PDFs, chat with your documents,
                    retrieve semantic answers using RAG,
                    and manage intelligent conversations
                    powered by LLMs.
                </p>

            </div>

            {/* RIGHT SECTION */}

            <div className="w-full lg:w-1/2 flex justify-center items-center px-6">

                <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">

                    <h2 className="text-3xl font-bold mb-2 text-center">

                        {isLogin ? "Welcome Back" : "Create Account"}

                    </h2>

                    <p className="text-gray-400 text-center mb-8">

                        {isLogin
                            ? "Login to continue"
                            : "Signup to get started"}

                    </p>

                    {/* ERROR */}

                    {error && (

                        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>

                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {!isLogin && (

                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />

                        )}

                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-lg bg-black/30 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 py-3 rounded-lg font-semibold"
                        >

                            {loading
                                ? "Please wait..."
                                : isLogin
                                    ? "Login"
                                    : "Create Account"}

                        </button>

                    </form>

                    {/* TOGGLE */}

                    <div className="mt-6 text-center text-gray-400">

                        {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}

                        <button
                            onClick={() =>
                                setIsLogin(!isLogin)
                            }
                            className="ml-2 text-purple-400 hover:text-purple-300 font-medium"
                        >

                            {isLogin ? "Signup" : "Login"}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Auth;