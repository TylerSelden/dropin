import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/critical.scss";

import { getLocalValue, setLocalValue, removeLocalValue } from "./utils/settings.js";

import Home from "./home/home";
import Chat from "./chat/chat";

export default function App() {
  const [theme, setTheme] = useState(getLocalValue("theme") || "light");
  const [loaded, setLoaded] = useState(false);
  const [mods, setMods] = useState(getLocalValue("mods") || []);

  useEffect(() => {
    var stylesheets = document.getElementsByName("stylesheet");
    var loadedSheets = 0;
    for (var stylesheet of stylesheets) {
      stylesheet.addEventListener("load", () => {
        loadedSheets++;
        if (loadedSheets === stylesheets.length) setLoaded(true);
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <>
        <link name="stylesheet" rel="stylesheet" href={`styles/${theme}.css`} />
        {mods.map((mod, index) => (
          <link key={index} name="stylesheet" rel="stylesheet" href={`styles/mods/${mod}.css`} />
        ))}
        {!loaded ? (
          <div className="loading-container">
            <div className="loading">
              <h2>Loading...</h2>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={ <Home /> }></Route>
            <Route path="/chat" element={ <Chat /> }></Route>
          </Routes>
        )}
      </>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <App />
)
