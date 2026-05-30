import { useState } from "react";

const responses = {
  accident: "🚨 Stay calm! Don't move if injured. Call 108 for ambulance immediately. Turn on hazard lights.",
  bleeding: "🩸 Apply pressure on the wound with a clean cloth. Keep the injured person still. Call 108 now!",
  fire: "🔥 Move away from the vehicle immediately! Don't open the bonnet. Call 101 for fire service.",
  unconscious: "😵 Don't move the person. Check breathing. Call 108 immediately. Keep them warm.",
  help: "🆘 I can help with: accident, bleeding, fire, unconscious. Type your emergency!",
  default: "🤖 Type your emergency: accident, bleeding, fire, or unconscious. I will guide you!"
};

function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "🤖 Hi! I am RoadSos AI Assistant. Type your emergency and I will guide you!" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    const lower = input.toLowerCase();
    const botReply = Object.keys(responses).find(k => lower.includes(k));
    const botMsg = { from: "bot", text: responses[botReply] || responses.default };
    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ color: "red", textAlign: "center" }}>🤖 RoadSos AI Assistant</h2>
      <div style={{ height: "400px", overflowY: "auto", backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "15px", marginBottom: "15px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === "user" ? "right" : "left", margin: "8px 0" }}>
            <span style={{ backgroundColor: msg.from === "user" ? "#ff4444" : "#fff", color: msg.from === "user" ? "white" : "black", padding: "10px 15px", borderRadius: "15px", display: "inline-block", maxWidth: "80%", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === "Enter" && sendMessage()}
          placeholder="Type your emergency..."
          style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #ccc", fontSize: "16px" }}
        />
        <button onClick={sendMessage} style={{ backgroundColor: "red", color: "white", padding: "12px 20px", borderRadius: "10px", border: "none", fontSize: "16px", cursor: "pointer" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;