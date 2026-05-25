import { useState } from "react";

const ChatInput = ({ onSend }) => {

    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!message.trim()) return;

        onSend(message);

        setMessage("");
    };

    return (

        <form
            onSubmit={handleSubmit}
            className="
                p-4
                border-t
                border-white/10
                bg-white/5
                backdrop-blur-lg
            "
        >

            <div className="flex gap-3">

                <input
                    type="text"
                    placeholder="Ask something about your document..."
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                    className="
                        flex-1
                        bg-black/30
                        border
                        border-white/10
                        rounded-xl
                        px-4
                        py-3
                        text-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-purple-500
                    "
                />

                <button
                    type="submit"
                    className="
                        bg-purple-600
                        hover:bg-purple-700
                        transition-all
                        px-6
                        rounded-xl
                        text-white
                        font-medium
                    "
                >
                    Send
                </button>

            </div>

        </form>
    );
};

export default ChatInput;