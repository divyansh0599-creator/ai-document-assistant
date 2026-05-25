import { useEffect, useRef } from "react";
const ChatWindow = ({
    messages,
    loading
    }) => {

        const bottomRef = useRef(null);
        useEffect(() => {

    bottomRef.current?.scrollIntoView({
        behavior: "smooth"
    });

}, [messages, loading]);

    return (

        <div
            className="
                flex-1
                overflow-y-auto
                px-6
                py-6
                space-y-4
            "
        >

            {messages.length === 0 ? (

                <div className="h-full flex items-center justify-center">

                    <div className="text-center">

                        <h2 className="text-3xl font-bold text-white mb-3">
                            Start Chatting
                        </h2>

                        <p className="text-gray-400">
                            Upload a PDF and ask questions
                        </p>

                    </div>

                </div>

            ) : (

                messages.map((msg, index) => (

                    <div
                        key={index}
                        className={`
                            max-w-3xl
                            p-4
                            rounded-2xl
                            ${
                                msg.role === "user"
                                    ? "bg-purple-600 ml-auto text-white"
                                    : "bg-white/10 text-gray-100"
                            }
                        `}
                    >

                        {msg.content}

                    </div>

                ))
                

            )}
            {loading && (

    <div
        className="
            max-w-3xl
            p-4
            rounded-2xl
            bg-white/10
            text-gray-300
        "
    >

        Thinking...

    </div>

)}
<div ref={bottomRef} />
        </div>
    );
};

export default ChatWindow;