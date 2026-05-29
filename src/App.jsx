import { useState } from "react";

function App() {
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [report, setReport] = useState({ name: "", description: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

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

  const handleCall = () => { window.location.href = "tel:999"; };

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
    const response = await fetch("http://localhost:5000/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });
    const data = await response.json();
    if (data.success) {
      setSubmitted(true);
      setShowForm(false);
      setStatus("✅ Accident report submitted successfully!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "30px", fontFamily: "Arial", backgroundColor: "#fff0f0", minHeight: "100vh" }}>
      <h1 style={{ color: "red", fontSize: "36px" }}>🚨 RoadSos AI</h1>
      <p style={{ fontSize: "16px", color: "#555" }}>Emergency help at one press</p>
      <button onClick={handleSOS} style={{ backgroundColor: "red", color: "white", fontSize: "32px", padding: "40px 70px", borderRadius: "50%", border: "none", cursor: "pointer", margin: "20px", boxShadow: "0 0 25px red" }}>
        SOS
      </button>
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap" }}>
        <button onClick={handleCall} style={{ backgroundColor: "#ff4444", color: "white", fontSize: "18px", padding: "15px 25px", borderRadius: "10px", border: "none", cursor: "pointer" }}>📞 Call 999</button>
        <button onClick={handleShare} style={{ backgroundColor: "#ff8800", color: "white", fontSize: "18px", padding: "15px 25px", borderRadius: "10px", border: "none", cursor: "pointer" }}>📍 Share Location</button>
        <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: "#cc0000", color: "white", fontSize: "18px", padding: "15px 25px", borderRadius: "10px", border: "none", cursor: "pointer" }}>📝 Report Accident</button>
      </div>
      {status && <p style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>{status}</p>}
      {showForm && (
        <div style={{ marginTop: "30px", backgroundColor: "white", padding: "20px", borderRadius: "15px", maxWidth: "400px", margin: "30px auto", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h2 style={{ color: "red" }}>📝 Accident Report</h2>
          <input placeholder="Your Name" value={report.name} onChange={e => setReport({ ...report, name: e.target.value })} style={{ width: "90%", padding: "10px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }} />
          <input placeholder="Your Phone" value={report.phone} onChange={e => setReport({ ...report, phone: e.target.value })} style={{ width: "90%", padding: "10px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }} />
          <textarea placeholder="Describe the accident..." value={report.description} onChange={e => setReport({ ...report, description: e.target.value })} style={{ width: "90%", padding: "10px", margin: "8px 0", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px", height: "80px" }} />
          <button onClick={handleSubmit} style={{ backgroundColor: "red", color: "white", padding: "12px 30px", fontSize: "16px", borderRadius: "8px", border: "none", cursor: "pointer", marginTop: "10px" }}>Submit Report</button>
        </div>
      )}
    </div>
  );
}

export default App;