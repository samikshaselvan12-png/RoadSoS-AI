const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage (for prototype)
let reports = [];
let unsafeAreas = [];

// ── Health check ──────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "RoadSos AI Backend is running! 🚨" });
});

// ── Accident Reports ──────────────────────────────────────────
app.get("/reports", (req, res) => {
  res.json(reports);
});

app.post("/reports", (req, res) => {
  const report = {
    id: Date.now(),
    name: req.body.name || "Anonymous",
    phone: req.body.phone || "",
    description: req.body.description || "",
    lat: req.body.lat || null,
    lng: req.body.lng || null,
    time: new Date().toISOString(),
  };
  reports.push(report);
  res.json({ success: true, report });
});

// ── Heatmap data ──────────────────────────────────────────────
app.get("/heatmap", (req, res) => {
  const heatmapData = reports
    .filter((r) => r.lat && r.lng)
    .map((r) => ({ lat: r.lat, lng: r.lng, intensity: 1 }));
  res.json(heatmapData);
});

// ── Statistics ────────────────────────────────────────────────
app.get("/statistics", (req, res) => {
  res.json({
    totalReports: reports.length,
    cities: ["Coimbatore", "Chennai", "Bangalore", "Mumbai", "Delhi"],
    accidents: [12, 34, 28, 45, 39],
  });
});

// ── Unsafe Areas ──────────────────────────────────────────────
app.get("/unsafe", (req, res) => {
  res.json(unsafeAreas);
});

app.post("/unsafe", (req, res) => {
  const area = {
    id: Date.now(),
    lat: req.body.lat,
    lng: req.body.lng,
    label: req.body.label || "Unsafe Area",
    time: new Date().toISOString(),
  };
  unsafeAreas.push(area);
  res.json({ success: true, area });
});

// ── Chat (AI response placeholder) ───────────────────────────
app.post("/chat", (req, res) => {
  const message = req.body.message || "";
  const responses = [
    "Stay calm. Move to a safe area away from traffic immediately.",
    "Call 108 for ambulance and 100 for police right away.",
    "Check if anyone is injured. Do not move seriously injured people.",
    "Turn on hazard lights and place warning triangles if available.",
    "Take photos of the accident scene for insurance purposes.",
  ];
  const reply = responses[Math.floor(Math.random() * responses.length)];
  res.json({ reply });
});

// ── Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`RoadSos AI backend running on port ${PORT} 🚨`);
});