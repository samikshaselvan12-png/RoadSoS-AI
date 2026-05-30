import { useState, useEffect } from "react";

function Admin() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("https://roadsos-ai.onrender.com/reports")
      .then((res) => res.json())
      .then((data) => setReports(data));
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1 style={{ color: "red" }}>🚨 RoadSos AI - Admin Dashboard</h1>
      <p>Total Reports: {reports.length}</p>
      {reports.length === 0 ? (
        <p>No reports yet.</p>
      ) : (
        reports.map((r, i) => (
          <div key={i} style={{ backgroundColor: "#fff0f0", padding: "15px", margin: "10px 0", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <p><strong>👤 Name:</strong> {r.name}</p>
            <p><strong>📞 Phone:</strong> {r.phone}</p>
            <p><strong>📝 Description:</strong> {r.description}</p>
            <p><strong>🕐 Time:</strong> {new Date(r.time).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Admin;