import { useMemo, useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://ai-document-backend-sveg.onrender.com";

function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const sessionId = useMemo(() => crypto.randomUUID(), []);

  const buildFallbackHistory = (answer) => [
    { role: "user", content: question.trim() },
    {
      role: "assistant",
      content: answer || "I could not read the response from the server.",
    },
  ];

  const uploadFile = async () => {
    if (!file) {
      setError("Choose a PDF before uploading.");
      return;
    }

    try {
      setIsUploading(true);
      setError("");
      setStatus("");

      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`${API_BASE_URL}/upload`, formData);
      setStatus(`${file.name} is ready.`);
    } catch {
      setError("Upload failed. Check that the backend is running and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const askAI = async () => {
    if (!question.trim()) {
      setError("Write a question first.");
      return;
    }

    try {
      setIsAsking(true);
      setError("");

      const res = await axios.post(`${API_BASE_URL}/ask`, {
        question: question.trim(),
        session_id: sessionId,
      });

      const responseHistory = Array.isArray(res.data.history)
        ? res.data.history
        : buildFallbackHistory(res.data.answer);

      setMessages(responseHistory);
      setQuestion("");
    } catch {
      setError("Could not get an answer. Make sure a document is uploaded.");
    } finally {
      setIsAsking(false);
    }
  };

  const clearHistory = async () => {
    try {
      setError("");
      await axios.delete(`${API_BASE_URL}/history/${sessionId}`);
      setMessages([]);
      setStatus("Conversation cleared.");
    } catch {
      setError("Could not clear the conversation.");
    }
  };

  const handleQuestionKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askAI();
    }
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-mark">DA</span>
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>Document Assistant</h1>
          </div>
        </div>

        <section className="panel upload-panel" aria-labelledby="upload-title">
          <div>
            <p className="eyebrow">Source</p>
            <h2 id="upload-title">Upload PDF</h2>
          </div>

          <label className="file-drop">
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => setFile(event.target.files[0] || null)}
            />
            <span className="file-icon">PDF</span>
            <span className="file-name">{file ? file.name : "Choose document"}</span>
          </label>

          <button
            className="primary-button"
            disabled={!file || isUploading}
            onClick={uploadFile}
          >
            {isUploading ? "Uploading..." : "Process Document"}
          </button>

          <div className="document-meta">
            <span>Status</span>
            <strong>{status || "Waiting for upload"}</strong>
          </div>
        </section>

        <section className="panel session-panel" aria-labelledby="session-title">
          <div>
            <p className="eyebrow">Session</p>
            <h2 id="session-title">Memory</h2>
          </div>
          <p className="session-count">{messages.length / 2} saved turns</p>
          <button
            className="secondary-button"
            disabled={!messages.length}
            onClick={clearHistory}
          >
            Clear Conversation
          </button>
        </section>
      </aside>

      <section className="chat-workspace" aria-labelledby="chat-title">
        <header className="chat-header">
          <div>
            <p className="eyebrow">RAG Chat</p>
            <h2 id="chat-title">Ask your document</h2>
          </div>
          <span className="connection-pill">Local API</span>
        </header>

        {error && (
          <div className="alert" role="alert">
            {error}
          </div>
        )}

        <div className="messages" aria-live="polite">
          {!messages.length && (
            <div className="empty-state">
              <h3>Start with a question</h3>
              <p>Upload a PDF, then ask about facts, summaries, clauses, or details inside it.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <article
              className={`message ${message.role === "user" ? "message-user" : "message-assistant"}`}
              key={`${message.role}-${index}`}
            >
              <span>{message.role === "user" ? "You" : "Assistant"}</span>
              <p>{message.content}</p>
            </article>
          ))}

          {isAsking && (
            <article className="message message-assistant">
              <span>Assistant</span>
              <p>Thinking...</p>
            </article>
          )}
        </div>

        <div className="composer">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleQuestionKeyDown}
            placeholder="Ask a follow-up about the uploaded document..."
            rows="3"
          />
          <button
            className="send-button"
            disabled={!question.trim() || isAsking}
            onClick={askAI}
          >
            {isAsking ? "Sending..." : "Ask"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Chat;
