import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function UnsafeMarker({ markers, setMarkers }) {
  useMapEvents({
    click(e) {
      setMarkers([...markers, { lat: e.latlng.lat, lng: e.latlng.lng }]);
    }
  });
  return null;
}

function WomenSafety() {
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [calling, setCalling] = useState(false);
  const [alerted, setAlerted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [shakeAlert, setShakeAlert] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  // Shake detection
  useEffect(() => {
    let lastX = 0, lastY = 0, lastZ = 0;
    const handleShake = (e) => {
      const { x, y, z } = e.accelerationIncludingGravity;
      const delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
      if (delta > 30) {
        setShakeAlert(true);
        handleWomenSOS();
        setTimeout(() => setShakeAlert(false), 3000);
      }
      lastX = x; lastY = y; lastZ = z;
    };
    window.addEventListener("devicemotion", handleShake);
    return () => window.removeEventListener("devicemotion", handleShake);
  }, []);

  const handleWomenSOS = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setAlerted(true);
        if (navigator.share) {
          navigator.share({ title: "🆘 EMERGENCY!", text: `I need help! My location: ${url}`, url });
        } else {
          navigator.clipboard.writeText(`🆘 EMERGENCY! My location: ${url}`);
        }
      },
      () => setAlerted(true)
    );
  };

  const handleFakeCall = () => {
    setShowFakeCall(true);
    setCalling(true);
    setTimeout(() => setCalling(false), 5000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "emergency_recording.webm";
        a.click();
        setRecordingDone(true);
      };
      recorder.start();
      setRecording(true);
      setTimeout(() => { recorder.stop(); setRecording(false); }, 30000);
    } catch {
      alert("Microphone access denied!");
    }
  };

  const stopRecording = () => {
    if (mediaRef.current) { mediaRef.current.stop(); setRecording(false); }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", backgroundColor: "#fff0f5", minHeight: "100vh", textAlign: "center" }}>
      <button onClick={() => window.location.href = "/"} style={{ float: "left", backgroundColor: "#ff4477", color: "white", padding: "8px 15px", borderRadius: "10px", border: "none", cursor: "pointer" }}>← Back</button>
      <h1 style={{ color: "#ff4477", fontSize: "36px" }}>👩 Women Safety</h1>
      <p style={{ color: "#888" }}>Your safety is our priority</p>

      {/* Shake Alert */}
      {shakeAlert && <div style={{ backgroundColor: "#ff4477", color: "white", padding: "15px", borderRadius: "10px", marginBottom: "15px", fontSize: "18px" }}>📳 Shake detected! SOS triggered!</div>}
      {alerted && <div style={{ backgroundColor: "#ff4477", color: "white", padding: "15px", borderRadius: "10px", marginBottom: "15px", fontSize: "18px" }}>✅ Emergency alert sent! Stay safe!</div>}

      {/* SOS Button */}
      <button onClick={handleWomenSOS} style={{ backgroundColor: "#ff4477", color: "white", fontSize: "28px", fontWeight: "bold", padding: "35px 60px", borderRadius: "50%", border: "4px solid #cc0055", cursor: "pointer", boxShadow: "0 0 30px #ff4477", margin: "20px" }}>
        SOS
      </button>

      <p style={{ color: "#ff4477", fontSize: "14px" }}>📳 Or shake your phone to trigger SOS!</p>

      {/* Feature Cards */}
      <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>

        {/* Fake Call */}
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px", maxWidth: "280px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: "#ff4477" }}>📞 Fake Call</h3>
          <p style={{ color: "#666", fontSize: "14px" }}>Pretend to receive a call to escape unsafe situations</p>
          <button onClick={handleFakeCall} style={{ backgroundColor: "#ff4477", color: "white", padding: "10px 25px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "16px" }}>Start Fake Call</button>
        </div>

        {/* Secret Recording */}
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px", maxWidth: "280px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: "#ff4477" }}>🎙️ Record Audio</h3>
          <p style={{ color: "#666", fontSize: "14px" }}>Secretly record audio as evidence during emergency</p>
          {!recording ? (
            <button onClick={startRecording} style={{ backgroundColor: "#ff4477", color: "white", padding: "10px 25px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "16px" }}>Start Recording</button>
          ) : (
            <button onClick={stopRecording} style={{ backgroundColor: "red", color: "white", padding: "10px 25px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "16px" }}>⏹️ Stop & Save</button>
          )}
          {recordingDone && <p style={{ color: "green", fontSize: "14px" }}>✅ Recording saved!</p>}
        </div>

        {/* Women Helplines */}
        <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "15px", maxWidth: "280px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h3 style={{ color: "#ff4477" }}>📱 Women Helplines</h3>
          {[["1091", "Women Helpline"], ["112", "Emergency"], ["181", "Women in Distress"], ["1098", "Child Helpline"]].map(([num, label]) => (
            <div key={num} style={{ display: "flex", justifyContent: "space-between", margin: "8px 0", padding: "8px", backgroundColor: "#fff0f5", borderRadius: "8px" }}>
              <span style={{ fontWeight: "bold", color: "#ff4477" }}>{num}</span>
              <span style={{ color: "#666", fontSize: "14px" }}>{label}</span>
              <button onClick={() => window.location.href = `tel:${num}`} style={{ backgroundColor: "#ff4477", color: "white", padding: "4px 10px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px" }}>Call</button>
            </div>
          ))}
        </div>
      </div>

      {/* Unsafe Areas Map */}
      <div style={{ marginTop: "30px" }}>
        <h3 style={{ color: "#ff4477" }}>🗺️ Mark Unsafe Areas</h3>
        <p style={{ color: "#888", fontSize: "14px" }}>Click on the map to mark unsafe areas in your city</p>
        <MapContainer center={[11.0928, 77.0241]} zoom={12} style={{ height: "400px", borderRadius: "15px", maxWidth: "600px", margin: "0 auto" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <UnsafeMarker markers={markers} setMarkers={setMarkers} />
          {markers.map((m, i) => (
            <Marker key={i} position={[m.lat, m.lng]}>
              <Popup>⚠️ Unsafe Area reported here</Popup>
            </Marker>
          ))}
        </MapContainer>
        <p style={{ color: "#ff4477", fontSize: "14px", marginTop: "10px" }}>⚠️ {markers.length} unsafe areas marked</p>
      </div>

      {/* Fake Call Screen */}
      {showFakeCall && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#1a1a1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#555", marginBottom: "20px", fontSize: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>👩</div>
          <h2 style={{ color: "white", fontSize: "28px" }}>Mom</h2>
          <p style={{ color: "#aaa", fontSize: "18px" }}>{calling ? "Incoming Call..." : "Call Ended"}</p>
          {calling && (
            <div style={{ display: "flex", gap: "30px", marginTop: "40px" }}>
              <button onClick={() => { setCalling(false); setShowFakeCall(false); }} style={{ backgroundColor: "red", color: "white", width: "70px", height: "70px", borderRadius: "50%", border: "none", fontSize: "28px", cursor: "pointer" }}>📵</button>
              <button onClick={() => setCalling(false)} style={{ backgroundColor: "green", color: "white", width: "70px", height: "70px", borderRadius: "50%", border: "none", fontSize: "28px", cursor: "pointer" }}>📞</button>
            </div>
          )}
          {!calling && <button onClick={() => setShowFakeCall(false)} style={{ marginTop: "20px", backgroundColor: "#ff4477", color: "white", padding: "10px 25px", borderRadius: "10px", border: "none", cursor: "pointer" }}>Close</button>}
        </div>
      )}
    </div>
  );
}

export default WomenSafety;