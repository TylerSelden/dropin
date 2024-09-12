import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { IoCloseOutline } from "react-icons/io5";

const Settings = ({ toggleSettings }) => {
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
            <select className="form-select">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <label>UI Theme:</label>
            <select className="form-select">
              <option value="classic">Classic</option>
              <option value="bubble">Bubble</option>
            </select>
          </div>
          <h3>User Data</h3>
          <div className="settings-group">
            <button className="btn btn-danger text-light">Clear stored data</button>
          </div>
        </div>
        <div className="settings-footer float-right">
          <button className="btn btn-secondary" onClick={toggleSettings}>Cancel</button>
          <button className="btn btn-primary text-light" onClick={toggleSettings}>Save</button>
        </div>
      </div>
    </div>
  )
}

export default Settings;
