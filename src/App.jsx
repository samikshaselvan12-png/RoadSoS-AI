import { useState, useEffect } from "react";

function App() {
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [report, setReport] = useState({ name: "", description: "", phone: "" });
  const [darkMode, setDarkMode] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const bg = darkMode ? "#1a1a1a" : "#fff0f0";
  const text = darkMode ? "white" : "#333";

  // Offline detection
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  const handleSOS = () => {
    setStatus("🚨 Getting help...");
    if (isOffline) {
      setStatus("📵 Offline mode — Call 112 (Global Emergency) directly!");
      window.location.href = "tel:112";
      return;
    }
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

  const handleCall = () => { window.location.href = "tel:112"; };

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

  const handleTowing = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        window.open(`https://www.google.com/maps/search/towing+service+OR+puncture+shop+OR+mechanic/@${latitude},${longitude},14z`, "_blank");
        setStatus("🔧 Searching nearby towing & repair services...");
      },
      () => {
        window.open("https://www.google.com/maps/search/towing+service+OR+puncture+shop+OR+mechanic/", "_blank");
        setStatus("🔧 Opened towing & repair search!");
      }
    );
  };

  const handleSubmit = async () => {
    if (isOffline) {
      // Save offline for later sync
      const saved = JSON.parse(localStorage.getItem("offlineReports") || "[]");
      saved.push({ ...report, timestamp: new Date().toISOString() });
      localStorage.setItem("offlineReports", JSON.stringify(saved));
      setShowForm(false);
      setStatus("📵 Offline — Report saved locally, will sync when online!");
      return;
    }
    try {
      const response = await fetch("https://roadsos-ai-fbfz.onrender.com/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      });
      const data = await response.json();
      if (data.success) {
        setShowForm(false);
        setStatus("✅ Accident report submitted successfully!");
      } else {
        setStatus("⚠️ Submission failed. Please try again.");
      }
    } catch (error) {
      setStatus("❌ Could not connect to server. Please try again.");
    }
  };

  // Sync offline reports when back online
  useEffect(() => {
    if (!isOffline) {
      const saved = JSON.parse(localStorage.getItem("offlineReports") || "[]");
      if (saved.length > 0) {
        saved.forEach(async (r) => {
          try {
            await fetch("https://roadsos-ai-fbfz.onrender.com/reports", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(r),
            });
          } catch (e) {}
        });
        localStorage.removeItem("offlineReports");
        setStatus(`✅ ${saved.length} offline report(s) synced!`);
      }
    }
  }, [isOffline]);

  const globalNumbers = [
    { country: "🌍 Global", numbers: [["112", "Emergency"], ["911", "USA/Canada"]] },
    { country: "🇮🇳 India", numbers: [["108", "Ambulance"], ["100", "Police"], ["101", "Fire"], ["1091", "Women"]] },
    { country: "🇬🇧 UK", numbers: [["999", "Emergency"], ["101", "Non-urgent"]] },
    { country: "🇦🇺 Australia", numbers: [["000", "Emergency"], ["106", "TTY"]] },
    { country: "🇦🇪 UAE", numbers: [["998", "Ambulance"], ["999", "Police"]] },
    { country: "🇸🇬 Singapore", numbers: [["995", "Ambulance"], ["999", "Police"]] },
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "'Segoe UI', Arial", backgroundColor: bg, minHeight: "100vh", color: text, transition: "all 0.3s" }}>

      {/* Offline Banner */}
      {isOffline && (
        <div style={{ backgroundColor: "#ff4444", color: "white", padding: "10px", borderRadius: "10px", marginBottom: "10px", fontSize: "14px", fontWeight: "bold" }}>
          📵 You are OFFLINE — Call 112 for global emergency. Reports saved locally.
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "14px", color: darkMode ? "#aaa" : "#888" }}>🚀 RoadSos AI v3.0</span>
        <button onClick={() => setDarkMode(!darkMode)} style={{ backgroundColor: darkMode ? "white" : "#333", color: darkMode ? "#333" : "white", padding: "8px 15px", borderRadius: "20px", border: "none", cursor: "pointer" }}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <h1 style={{ color: "red", fontSize: "42px", margin: "10px 0", textShadow: "0 0 20px rgba(255,0,0,0.3)" }}>🚨 RoadSos AI</h1>
      <p style={{ fontSize: "16px", color: darkMode ? "#aaa" : "#555", marginBottom: "5px" }}>Saving lives, one press at a time 💡</p>
      <p style={{ fontSize: "13px", color: darkMode ? "#777" : "#999", marginBottom: "15px" }}>Powered by AI • 🌍 Global Emergency Tool</p>

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

      {/* Action Buttons Row 1 */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginTop: "10px" }}>
        <button onClick={handleCall} style={{ backgroundColor: "#ff4444", color: "white", fontSize: "16px", padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>📞 Call 112</button>
        <button onClick={handleShare} style={{ backgroundColor: "#ff8800", color: "white", fontSize: "16px", padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>📍 Share Location</button>
        <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: "#cc0000", color: "white", fontSize: "16px", padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>📝 Report Accident</button>
        <button onClick={() => setShowTips(!showTips)} style={{ backgroundColor: "#880000", color: "white", fontSize: "16px", padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>💡 First Aid Tips</button>
      </div>

      {/* Action Buttons Row 2 - NEW */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginTop: "10px" }}>
        <button onClick={handleTowing} style={{ backgroundColor: "#cc6600", color: "white", fontSize: "16px", padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>🔧 Towing & Repair</button>
        <button onClick={() => setShowNumbers(!showNumbers)} style={{ backgroundColor: "#660066", color: "white", fontSize: "16px", padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer" }}>🌍 Global Numbers</button>
      </div>

      {status && <p style={{ marginTop: "15px", fontSize: "16px", color: darkMode ? "#aaa" : "#333" }}>{status}</p>}

      {/* Emergency Numbers - India */}
      <div style={{ marginTop: "20px", backgroundColor: darkMode ? "#333" : "white", padding: "15px", borderRadius: "15px", maxWidth: "400px", margin: "20px auto", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
        <h3 style={{ color: "red", margin: "0 0 10px" }}>🆘 Emergency Numbers</h3>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "10px" }}>
          {[["🌍 112", "Global"], ["🚑 108", "Ambulance"], ["🚔 100", "Police"], ["🔥 101", "Fire"], ["👩 1091", "Women"]].map(([num, label]) => (
            <div key={num} style={{ textAlign: "center", cursor: "pointer" }} onClick={() => window.location.href = `tel:${num.replace(/\D/g, "")}`}>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "red" }}>{num}</div>
              <div style={{ fontSize: "12px", color: darkMode ? "#aaa" : "#666" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Numbers Panel */}
      {showNumbers && (
        <div style={{ marginTop: "20px", backgroundColor: darkMode ? "#333" : "white", padding: "20px", borderRadius: "15px", maxWidth: "500px", margin: "20px auto", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "left" }}>
          <h3 style={{ color: "red", marginBottom: "15px" }}>🌍 Global Emergency Numbers</h3>
          {globalNumbers.map(({ country, numbers }) => (
            <div key={country} style={{ marginBottom: "12px" }}>
              <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "5px" }}>{country}</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {numbers.map(([num, label]) => (
                  <div key={num} onClick={() => window.location.href = `tel:${num}`}
                    style={{ backgroundColor: darkMode ? "#444" : "#fff0f0", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", border: "1px solid #ffcccc" }}>
                    <span style={{ color: "red", fontWeight: "bold" }}>{num}</span>
                    <span style={{ fontSize: "12px", color: darkMode ? "#aaa" : "#666", marginLeft: "5px" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* First Aid Tips */}
      {showTips && (
        <div style={{ marginTop: "20px", backgroundColor: darkMode ? "#333" : "white", padding: "20px", borderRadius: "15px", maxWidth: "400px", margin: "20px auto", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", textAlign: "left" }}>
          <h3 style={{ color: "red" }}>💡 First Aid Tips</h3>
          {["🩸 Apply pressure on bleeding wounds", "😵 Don't move unconscious person", "🔥 Move away from fire immediately", "📞 Call 112 before doing anything", "🚗 Turn on hazard lights", "⛔ Don't remove helmet forcefully"].map((tip, i) => (
            <p key={i} style={{ margin: "8px 0", fontSize: "14px" }}>{tip}</p>
          ))}
        </div>
      )}

      {/* Accident Form */}
      {showForm && (
        <div style={{ marginTop: "20px", backgroundColor: darkMode ? "#333" : "white", padding: "20px", borderRadius: "15px", maxWidth: "400px", margin: "20px auto", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h2 style={{ color: "red" }}>📝 Accident Report</h2>
          {isOffline && <p style={{ color: "#ff4444", fontSize: "13px" }}>📵 Offline — report will be saved and auto-synced when online</p>}
          <input placeholder="Your Name" value={report.name} onChange={e => setReport({ ...report, name: e.target.value })} style={{ width: "90%", padding: "10px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }} />
          <input placeholder="Your Phone" value={report.phone} onChange={e => setReport({ ...report, phone: e.target.value })} style={{ width: "90%", padding: "10px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }} />
          <textarea placeholder="Describe the accident..." value={report.description} onChange={e => setReport({ ...report, description: e.target.value })} style={{ width: "90%", padding: "10px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", height: "80px" }} />
          <button onClick={handleSubmit} style={{ backgroundColor: "red", color: "white", padding: "12px 30px", fontSize: "16px", borderRadius: "8px", border: "none", cursor: "pointer", marginTop: "10px" }}>Submit Report</button>
        </div>
      )}

      <div style={{ marginTop: "30px", padding: "20px", borderTop: "1px solid #ffcccc" }}>
        <p style={{ fontSize: "14px", color: darkMode ? "#777" : "#aaa" }}>👩‍💻 Created by <strong style={{ color: "red" }}>Samiksha</strong></p>
        <p style={{ fontSize: "12px", color: darkMode ? "#666" : "#bbb" }}>🌍 Making Roads Safer Globally • RoadSos AI © 2026</p>
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
