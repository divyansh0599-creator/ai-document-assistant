import { useState } from "react";

import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";
import ChatWindow from "../component/ChatWindow";
import ChatInput from "../component/ChatInput";
import api from "../services/api";

const Chat = () => {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    

   const handleSend = async (message) => {

    // ADD USER MESSAGE IMMEDIATELY

    const userMessage = {
        role: "user",
        content: message
    };

    setMessages((prev) => [
        ...prev,
        userMessage
    ]);

    try {

        setLoading(true);

        const response = await api.post(
            "/ask",
            {
                question: message,
                session_id: "default"
            }
        );

        const aiMessage = {
            role: "assistant",
            content: response.data.answer
        };

        setMessages((prev) => [
            ...prev,
            aiMessage
        ]);

    } catch (error) {

        console.error(error);

        const errorMessage = {
            role: "assistant",
            content: "Something went wrong."
        };

        setMessages((prev) => [
            ...prev,
            errorMessage
        ]);

    } finally {

        setLoading(false);
    }
};

    return (

        <div className="h-screen flex bg-black">

            {/* SIDEBAR */}

            <Sidebar />

            {/* MAIN SECTION */}

            <div className="flex-1 flex flex-col">

                <Navbar />

                <ChatWindow
                    messages={messages}
                    loading={loading}
                />

                <ChatInput onSend={handleSend} />

            </div>

        </div>
    );
};

export default Chat;