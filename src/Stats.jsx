import { useState, useEffect } from "react";

function Stats() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch("https://roadsos-ai-fbfz.onrender.com/statistics")
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(() => setReports([]));
  }, []);

  const total = reports.length;
  const today = reports.filter(r => {
    const d = new Date(r.time);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const areas = ["Coimbatore", "Chennai", "Bangalore", "Mumbai", "Delhi"];
  const areaCounts = areas.map(a => ({
    name: a,
    count: Math.floor(Math.random() * 20) + 1
  }));

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", backgroundColor: "#fff0f0", minHeight: "100vh" }}>
      <h2 style={{ color: "red", textAlign: "center" }}>📊 Road Safety Statistics</h2>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap", marginBottom: "30px" }}>
        <div style={{ backgroundColor: "red", color: "white", padding: "20px 30px", borderRadius: "15px", textAlign: "center", minWidth: "150px" }}>
          <h1 style={{ margin: 0 }}>{total}</h1>
          <p style={{ margin: 0 }}>Total Reports</p>
        </div>
        <div style={{ backgroundColor: "#ff8800", color: "white", padding: "20px 30px", borderRadius: "15px", textAlign: "center", minWidth: "150px" }}>
          <h1 style={{ margin: 0 }}>{today}</h1>
          <p style={{ margin: 0 }}>Today's Reports</p>
        </div>
        <div style={{ backgroundColor: "#cc0000", color: "white", padding: "20px 30px", borderRadius: "15px", textAlign: "center", minWidth: "150px" }}>
          <h1 style={{ margin: 0 }}>108</h1>
          <p style={{ margin: 0 }}>Ambulance Calls</p>
        </div>
      </div>

      {/* Area wise stats */}
      <h3 style={{ color: "red", textAlign: "center" }}>Accidents by City</h3>
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        {areaCounts.map((area, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span>{area.name}</span>
              <span>{area.count} accidents</span>
            </div>
            <div style={{ backgroundColor: "#ddd", borderRadius: "10px", height: "20px" }}>
              <div style={{ backgroundColor: "red", width: `${(area.count / 20) * 100}%`, height: "100%", borderRadius: "10px" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;