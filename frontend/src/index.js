import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/critical.scss";

import { getLocalValue, setLocalValue, removeLocalValue } from "./utils/settings.js";

import Home from "./home/home";
import Chat from "./chat/chat";

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (getLocalValue("theme")) setTheme(getLocalValue("theme"));
  }, []);

  return (
    <BrowserRouter>
      <>
        <link rel="stylesheet" href={`styles/${theme}.css`} />
        <Routes>
          <Route path="/" element={ <Home /> }></Route>
          <Route path="/chat" element={ <Chat /> }></Route>
        </Routes>
      </>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <App />
)
