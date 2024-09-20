import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { getLocalValue, setLocalValue, removeLocalValue } from "../utils/settings.js";

import { IoCloseOutline } from "react-icons/io5";

const Settings = ({ toggleSettings }) => {
  const themeRef = useRef(null);
  const uiRef = useRef(null);
  const colorblindRef = useRef(null);

  useEffect(() => {
    themeRef.current.value = getLocalValue("theme") || "light";
    uiRef.current.value = getLocalValue("ui") || "classic";
    
    var mods = getLocalValue("mods") || [];
    colorblindRef.current.value = mods.includes("colorblind") ? "enabled" : "disabled";
  })
  
  const clearData = () => {
    removeLocalValue();
    window.location.reload();
  }

  const saveData = () => {
    setLocalValue("theme", themeRef.current.value);
    setLocalValue("ui", uiRef.current.value);
    
    var mods = [];
    if (colorblindRef.current.value === "enabled") mods.push("colorblind");

    setLocalValue("mods", mods);

    window.location.reload();
  }

  return (
    <div>
      <div className="settings-bg" onClick={toggleSettings}></div>
      <div className="settings-window">
        <div className="settings-header">
          <h2 className="m-0 p-0">Settings</h2>
        </div>
        <div className="settings-body mt-3">
          <h3>UI Elements</h3>
          <div className="settings-group">
            <label>Color Scheme:</label>
            <select className="form-select" ref={themeRef}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <label>UI Theme:</label>
            <select className="form-select" ref={uiRef}>
              <option value="classic">Classic</option>
              <option value="bubble" disabled>Bubble (coming soon!)</option>
            </select>
          </div>
          <h3>Accessibility</h3>
          <div className="settings-group">
            <label>Colorblind mode:</label>
            <select className="form-select" ref={colorblindRef}>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <h3>User Data</h3>
          <div className="settings-group">
            <button className="btn btn-danger text-light" onClick={clearData}>Clear stored data</button>
          </div>
        </div>
        <div className="settings-footer float-right">
          <button className="btn btn-secondary" onClick={toggleSettings}>Cancel</button>
          <button className="btn btn-primary text-light-force" onClick={saveData}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default Settings;
