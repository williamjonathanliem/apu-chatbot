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
    { role: "assistant", content: "Hi! I'm APUBot 👋 Your student assistant for Asia Pacific University. Ask me anything about campus, courses, accommodation, or student life!" }
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
      const res = await fetch("http://localhost:3001/chat", {
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
        content: "I couldn't reach the server. Make sure the backend is running on port 3001."
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>

      {/* Outer glow card */}
      <div style={{
        width: "100%",
        maxWidth: "860px",
        height: "88vh",
        borderRadius: "24px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backdropFilter: "blur(20px)",
      }}>

        {/* Header */}
        <div style={{
          padding: "18px 24px",
          background: "rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}>
          <div style={{
            width: "46px", height: "46px", borderRadius: "14px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", flexShrink: 0
          }}>🎓</div>
          <div>
            <div style={{ color: "white", fontWeight: "700", fontSize: "17px", letterSpacing: "-0.3px" }}>APUBot</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>Asia Pacific University Assistant</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80" }} />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>Online</span>
          </div>
        </div>

        {/* Messages area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.15) transparent"
        }}>

          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-end",
              gap: "10px",
              marginBottom: "12px"
            }}>
              {/* Avatar */}
              <div style={{
                width: "34px", height: "34px", borderRadius: "10px", flexShrink: 0,
                background: msg.role === "assistant"
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px"
              }}>
                {msg.role === "assistant" ? "🎓" : "👤"}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: "68%",
                padding: "12px 16px",
                borderRadius: msg.role === "assistant" ? "4px 18px 18px 18px" : "18px 4px 18px 18px",
                background: msg.role === "assistant"
                  ? "rgba(255,255,255,0.1)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                fontSize: "14px",
                lineHeight: "1.65",
                border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.12)" : "none",
                backdropFilter: "blur(10px)"
              }}>
                <div className="md-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", marginBottom: "12px" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "10px",
                background: "linear-gradient(135deg, #8284ffff, rgba(240, 233, 255, 1))",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
              }}>🎓</div>
              <div style={{
                padding: "14px 18px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "4px 18px 18px 18px",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex", gap: "5px", alignItems: "center"
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.6)",
                    animation: "pulse 1.2s infinite",
                    animationDelay: `${i * 0.2}s`
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Suggested questions */}
          {showSuggestions && (
            <div style={{ marginTop: "8px" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginBottom: "10px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Suggested questions
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {SUGGESTED.map((q, i) => (
                  <button key={i} onClick={() => sendMessage(q)} style={{
                    padding: "8px 14px",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    backdropFilter: "blur(10px)"
                  }}
                    onMouseEnter={e => {
                      e.target.style.background = "rgba(255,255,255,0.15)";
                      e.target.style.borderColor = "rgba(255,255,255,0.35)";
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = "rgba(255,255,255,0.07)";
                      e.target.style.borderColor = "rgba(255,255,255,0.2)";
                    }}
                  >{q}</button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{
          padding: "16px 20px",
          background: "rgba(255,255,255,0.05)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          gap: "10px",
          alignItems: "flex-end"
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
              flex: 1,
              padding: "12px 16px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              fontSize: "14px",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: "1.5",
              maxHeight: "120px",
              backdropFilter: "blur(10px)"
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              width: "44px", height: "44px",
              borderRadius: "14px",
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #d8d9ffff, #8b5cf6)"
                : "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
              transition: "all 0.15s",
              flexShrink: 0
            }}
          >
            {loading ? "⏳" : "➤"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        textarea::placeholder { color: rgba(255,255,255,0.35); }
        textarea:focus { border-color: rgba(255, 255, 255, 0.6) !important; }
        .md-content p { margin: 0 0 8px; }
        .md-content p:last-child { margin: 0; }
        .md-content ul, .md-content ol { padding-left: 18px; margin: 0 0 8px; }
        .md-content li { margin-bottom: 3px; }
        .md-content strong { font-weight: 600; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>
    </div>
  );
}