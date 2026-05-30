import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Admin from "./Admin.jsx";
import Heatmap from "./Heatmap.jsx";
import Chatbot from "./Chatbot.jsx";
import Stats from "./Stats.jsx";
import WomenSafety from "./WomenSafety.jsx";

const page = window.location.search;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {page === "?admin" ? <Admin /> :
     page === "?heatmap" ? <Heatmap /> :
     page === "?chatbot" ? <Chatbot /> :
     page === "?stats" ? <Stats /> :
     page === "?women" ? <WomenSafety /> :
     <App />}
  </StrictMode>
);