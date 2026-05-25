import { useContext } from "react";
import { useState } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {

    const { logout } = useContext(AuthContext);
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {

        setUploading(true);

        const response = await api.post(
            "/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        alert(response.data.message);

    } catch (error) {

        console.error(error);

        alert(
            error.response?.data?.detail ||
            "Upload failed"
        );

    } finally {

        setUploading(false);
    }
};

    return (

        <div className="w-72 bg-white/10 backdrop-blur-lg border-r border-white/10 p-5 flex flex-col">

            {/* LOGO */}

            <div className="mb-8">

                <h1 className="text-2xl font-bold text-white">
                    AI Assistant
                </h1>

                <p className="text-gray-400 text-sm mt-1">
                    Document RAG Chat
                </p>

            </div>

            {/* NEW CHAT */}

            <button
                className="
                    w-full
                    bg-purple-600
                    hover:bg-purple-700
                    transition-all
                    py-3
                    rounded-xl
                    font-medium
                    text-white
                    mb-4
                "
            >
                + New Chat
            </button>

            {/* UPLOAD */}

            <div className="mb-6">

                <label
                    className="
                        block
                        text-sm
                        text-gray-300
                        mb-2
                    "
                >
                    Upload Document
                </label>

                <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileUpload}
                    className="
                        w-full
                        text-sm
                        text-gray-300
                        file:mr-4
                        file:py-2
                        file:px-4
                        file:rounded-lg
                        file:border-0
                        file:bg-purple-600
                        file:text-white
                        hover:file:bg-purple-700
                    "
                />
                {uploading && (
                    <p className="text-sm text-purple-300 mt-2">
                        Uploading document...
                    </p>
                )}

            </div>

            {/* CHAT HISTORY PLACEHOLDER */}

            <div className="flex-1 overflow-y-auto">

                <p className="text-gray-400 text-sm mb-3">
                    Recent Chats
                </p>

                <div className="space-y-2">

                    <div className="bg-white/5 p-3 rounded-lg text-sm text-gray-300 cursor-pointer hover:bg-white/10">
                        Project Discussion
                    </div>

                    <div className="bg-white/5 p-3 rounded-lg text-sm text-gray-300 cursor-pointer hover:bg-white/10">
                        Research Notes
                    </div>

                </div>

            </div>

            {/* LOGOUT */}

            <button
                onClick={logout}
                className="
                    mt-6
                    bg-red-500/20
                    hover:bg-red-500/30
                    border
                    border-red-500/20
                    py-3
                    rounded-xl
                    text-red-300
                    transition-all
                "
            >
                Logout
            </button>

        </div>
    );
};

export default Sidebar; 
