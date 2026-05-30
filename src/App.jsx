import { useState } from "react";

function App() {
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [report, setReport] = useState({ name: "", description: "", phone: "" });
  const [darkMode, setDarkMode] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const bg = darkMode ? "#1a1a1a" : "#fff0f0";
  const text = darkMode ? "white" : "#333";

  const handleSOS = () => {
    setStatus("🚨 Getting help...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setStatus(`✅ Location found! Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        window.open(`https://www.google.com/maps/search/hospital+OR+police/@${latitude},${longitude},14z`, "_blank");
      },
      () => {
        window.open("https://www.google.com/maps/search/hospital+OR+police+station/", "_blank");
        setStatus("✅ Opened nearest help!");
      }
    );
  };

  const handleCall = () => { window.location.href = "tel:108"; };

  const handleShare = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        if (navigator.share) {
          navigator.share({ title: "My Location - RoadSos AI", url });
        } else {
          navigator.clipboard.writeText(url);
          setStatus("📋 Location link copied!");
        }
      },
      () => setStatus("❌ Location access denied.")
    );
  };

  const handleSubmit = async () => {
    const response = fetch("https://roadsos-ai-fbfz.onrender.com/reports"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
    const data = await response.json();
    if (data.success) {
      setShowForm(false);
      setStatus("✅ Accident report submitted successfully!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "'Segoe UI', Arial", backgroundColor: bg, minHeight: "100vh", color: text, transition: "all 0.3s" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "14px", color: darkMode ? "#aaa" : "#888" }}>🚀 RoadSos AI v2.0</span>
        <button onClick={() => setDarkMode(!darkMode)} style={{ backgroundColor: darkMode ? "white" : "#333", color: darkMode ? "#333" : "white", padding: "8px 15px", borderRadius: "20px", border: "none", cursor: "pointer" }}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Title */}
      <h1 style={{ color: "red", fontSize: "42px", margin: "10px 0", textShadow: "0 0 20px rgba(255,0,0,0.3)" }}>🚨 RoadSos AI</h1>
      <p style={{ fontSize: "16px", color: darkMode ? "#aaa" : "#555", marginBottom: "5px" }}>Saving lives, one press at a time 💡</p>
      <p style={{ fontSize: "13px", color: darkMode ? "#777" : "#999", marginBottom: "15px" }}>Powered by AI • Built for India 🇮🇳</p>

      {/* Navigation Menu */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        {[["🗺️ Heatmap", "?heatmap"], ["🤖 AI Chat", "?chatbot"], ["📊 Statistics", "?stats"], ["👩 Women Safety", "?women"], ["👨‍💼 Admin", "?admin"]].map(([label, href]) => (
          <button key={href} onClick={() => window.location.href = href} style={{ backgroundColor: darkMode ? "#444" : "#cc0000", color: "white", padding: "8px 15px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px" }}>
            {label}
          </button>
        ))}
      </div>

      {/* SOS Button */}
      <div style={{ position: "relative", display: "inline-block", margin: "20px" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "180px", height: "180px", borderRadius: "50%", backgroundColor: "rgba(255,0,0,0.2)", animation: "pulse 1.5s infinite" }} />
        <button onClick={handleSOS} style={{ backgroundColor: "red", color: "white", fontSize: "32px", fontWeight: "bold", padding: "40px 60px", borderRadius: "50%", border: "4px solid darkred", cursor: "pointer", boxShadow: "0 0 30px red", position: "relative", zIndex: 1 }}>
          SOS
        </button>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginTop: "10px" }}>
        <button onClick={handleCall} style={{ backgroundColor: "#ff4444", color: "white", fontSize: "16px", padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>📞 Call 108</button>
        <button onClick={handleShare} style={{ backgroundColor: "#ff8800", color: "white", fontSize: "16px", padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>📍 Share Location</button>
        <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: "#cc0000", color: "white", fontSize: "16px", padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>📝 Report Accident</button>
        <button onClick={() => setShowTips(!showTips)} style={{ backgroundColor: "#880000", color: "white", fontSize: "16px", padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>💡 First Aid Tips</button>
      </div>

      {/* Status */}
      {status && <p style={{ marginTop: "15px", fontSize: "16px", color: darkMode ? "#aaa" : "#333" }}>{status}</p>}

      {/* Emergency Numbers */}
      <div style={{ marginTop: "20px", backgroundColor: darkMode ? "#333" : "white", padding: "15px", borderRadius: "15px", maxWidth: "400px", margin: "20px auto", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
        <h3 style={{ color: "red", margin: "0 0 10px" }}>🆘 Emergency Numbers</h3>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "10px" }}>
          {[["🚑 108", "Ambulance"], ["🚔 100", "Police"], ["🔥 101", "Fire"], ["👩 1091", "Women"]].map(([num, label]) => (
            <div key={num} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "red" }}>{num}</div>
              <div style={{ fontSize: "12px", color: darkMode ? "#aaa" : "#666" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* First Aid Tips */}
      {showTips && (
        <div style={{ marginTop: "20px", backgroundColor: darkMode ? "#333" : "white", padding: "20px", borderRadius: "15px", maxWidth: "400px", margin: "20px auto", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "left" }}>
          <h3 style={{ color: "red" }}>💡 First Aid Tips</h3>
          {["🩸 Apply pressure on bleeding wounds", "😵 Don't move unconscious person", "🔥 Move away from fire immediately", "📞 Call 108 before doing anything", "🚗 Turn on hazard lights", "⛔ Don't remove helmet forcefully"].map((tip, i) => (
            <p key={i} style={{ margin: "8px 0", fontSize: "14px" }}>{tip}</p>
          ))}
        </div>
      )}

      {/* Accident Form */}
      {showForm && (
        <div style={{ marginTop: "20px", backgroundColor: darkMode ? "#333" : "white", padding: "20px", borderRadius: "15px", maxWidth: "400px", margin: "20px auto", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h2 style={{ color: "red" }}>📝 Accident Report</h2>
          <input placeholder="Your Name" value={report.name} onChange={e => setReport({ ...report, name: e.target.value })} style={{ width: "90%", padding: "10px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }} />
          <input placeholder="Your Phone" value={report.phone} onChange={e => setReport({ ...report, phone: e.target.value })} style={{ width: "90%", padding: "10px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }} />
          <textarea placeholder="Describe the accident..." value={report.description} onChange={e => setReport({ ...report, description: e.target.value })} style={{ width: "90%", padding: "10px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", height: "80px" }} />
          <button onClick={handleSubmit} style={{ backgroundColor: "red", color: "white", padding: "12px 30px", fontSize: "16px", borderRadius: "8px", border: "none", cursor: "pointer", marginTop: "10px" }}>Submit Report</button>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "30px", padding: "20px", borderTop: "1px solid #ffcccc" }}>
        <p style={{ fontSize: "14px", color: darkMode ? "#777" : "#aaa" }}>👩‍💻 Created by <strong style={{ color: "red" }}>Samiksha</strong></p>
        <p style={{ fontSize: "12px", color: darkMode ? "#666" : "#bbb" }}>🌍 Making India safer with AI • RoadSos AI © 2026</p>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

export default App;