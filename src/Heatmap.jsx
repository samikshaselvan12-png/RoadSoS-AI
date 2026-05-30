import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const accidentData = [
  { lat: 11.0928, lng: 77.0241, count: 15, area: "Coimbatore Central" },
  { lat: 11.1085, lng: 77.0103, count: 8, area: "Gandhipuram" },
  { lat: 11.0737, lng: 77.0538, count: 12, area: "Singanallur" },
  { lat: 11.0594, lng: 76.9842, count: 6, area: "Kuniyamuthur" },
  { lat: 11.1234, lng: 77.0456, count: 10, area: "Saravanampatti" },
];

const getColor = (count) => {
  if (count >= 15) return "red";
  if (count >= 10) return "orange";
  return "yellow";
};

function Heatmap() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2 style={{ color: "red", textAlign: "center" }}>
        🗺️ Accident Heatmap
      </h2>
      <p style={{ textAlign: "center", color: "#555" }}>
        Red = High Risk | Orange = Medium Risk | Yellow = Low Risk
      </p>
      <MapContainer
        center={[11.0928, 77.0241]}
        zoom={12}
        style={{ height: "500px", borderRadius: "15px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {accidentData.map((spot, i) => (
          <Circle
            key={i}
            center={[spot.lat, spot.lng]}
            radius={spot.count * 100}
            color={getColor(spot.count)}
            fillColor={getColor(spot.count)}
            fillOpacity={0.5}
          >
            <Popup>
              <b>{spot.area}</b>
              <br />
              Accidents: {spot.count}
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}

export default Heatmap;