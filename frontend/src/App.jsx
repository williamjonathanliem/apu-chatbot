import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const SUGGESTED = [
  "What facilities does APU have?",
  "How much does accommodation cost?",
  "Where is the LRT station?",
  "How do I appeal a grade?",
  "What programmes does APU offer?",
  "Is there a counselling service?",
];

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm APUBot, your student assistant for Asia Pacific University. What can I help you with today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setShowSuggestions(false);
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply || data.error || "Sorry, something went wrong."
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Couldn't reach the server. Make sure the backend is running."
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; }
        #root { width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; }
        .md p { margin-bottom: 6px; line-height: 1.6; }
        .md p:last-child { margin-bottom: 0; }
        .md ul, .md ol { padding-left: 18px; margin-bottom: 6px; }
        .md li { margin-bottom: 3px; line-height: 1.55; }
        .md strong { font-weight: 600; }
        .md h1,.md h2,.md h3 { font-size: 14px; font-weight: 600; margin-bottom: 6px; margin-top: 8px; }
        .messages::-webkit-scrollbar { width: 4px; }
        .messages::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
        textarea:focus { outline: none; border-color: #1d1d1f !important; }
        textarea::placeholder { color: #aaa; }
        @keyframes bounce {
          0%,60%,100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: #ccc; animation: bounce 1.2s infinite; }
        .chip:hover { background: #f0f0f0 !important; border-color: #ccc !important; }
        .send-btn:hover { background: #333 !important; }
        .send-btn:disabled { background: #e5e5e5 !important; cursor: not-allowed; }
      `}</style>

      <div style={{
        width: "100%", maxWidth: "780px", height: "90vh",
        background: "#fff", borderRadius: "20px",
        border: "1px solid #e8e8e8",
        display: "flex", flexDirection: "column", overflow: "hidden",
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)"
      }}>

        {/* Header */}
        <div style={{
          padding: "16px 22px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex", alignItems: "center", gap: "12px"
        }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "10px",
            background: "#1d1d1f",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", flexShrink: 0
          }}>🎓</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#1d1d1f", letterSpacing: "-0.2px" }}>APUBot</div>
            <div style={{ fontSize: "12px", color: "#888" }}>APU Student Assistant</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34c759" }} />
            <span style={{ fontSize: "12px", color: "#888" }}>Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="messages" style={{
          flex: 1, overflowY: "auto", padding: "24px 22px",
          display: "flex", flexDirection: "column"
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "14px",
              alignItems: "flex-end", gap: "8px"
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  width: "28px", height: "28px", borderRadius: "8px",
                  background: "#1d1d1f", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "13px", flexShrink: 0
                }}>🎓</div>
              )}
              <div style={{
                maxWidth: "72%",
                padding: "11px 15px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                background: msg.role === "user" ? "#1d1d1f" : "#f5f5f7",
                color: msg.role === "user" ? "#fff" : "#1d1d1f",
                fontSize: "14px",
                lineHeight: "1.6"
              }}>
                <div className="md"><ReactMarkdown>{msg.content}</ReactMarkdown></div>
              </div>
            </div>
          ))}

          {/* Typing dots */}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "14px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: "#1d1d1f", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: "13px"
              }}>🎓</div>
              <div style={{
                padding: "13px 16px", background: "#f5f5f7",
                borderRadius: "4px 16px 16px 16px",
                display: "flex", gap: "4px", alignItems: "center"
              }}>
                <div className="dot" style={{ animationDelay: "0s" }} />
                <div className="dot" style={{ animationDelay: "0.2s" }} />
                <div className="dot" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}

          {/* Suggested chips */}
          {showSuggestions && (
            <div style={{ marginTop: "4px" }}>
              <p style={{ fontSize: "11px", color: "#aaa", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Suggested
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                {SUGGESTED.map((q, i) => (
                  <button key={i} className="chip" onClick={() => sendMessage(q)} style={{
                    padding: "7px 13px", borderRadius: "20px",
                    border: "1px solid #e5e5e5", background: "#fafafa",
                    color: "#1d1d1f", fontSize: "13px", cursor: "pointer",
                    transition: "all 0.12s"
                  }}>{q}</button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: "14px 18px",
          borderTop: "1px solid #f0f0f0",
          display: "flex", gap: "10px", alignItems: "flex-end"
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask me anything about APU..."
            rows={1}
            style={{
              flex: 1, padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid #e5e5e5",
              background: "#fafafa",
              color: "#1d1d1f",
              fontSize: "14px",
              resize: "none", fontFamily: "inherit",
              lineHeight: "1.5", maxHeight: "120px"
            }}
          />
          <button
            className="send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: input.trim() && !loading ? "#1d1d1f" : "#e5e5e5",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "background 0.12s", fontSize: "16px"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8L14 8M14 8L9 3M14 8L9 13" stroke={input.trim() && !loading ? "#fff" : "#aaa"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}