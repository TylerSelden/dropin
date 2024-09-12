import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { IoMdSettings } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

const Header = () => {
  const [showSettings, setShowSettings] = useState(false);
  
  useEffect(() => {
    document.body.style.overflow = showSettings ? "hidden" : "auto";
  }, [showSettings]);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  }

  return (
    <div>
      { /* WHY DOES THIS WORK?!?!?! A non-sticky header that's the exact same so the spacing is the same too....*/ }
      <div className="header bg-primary text-light p-2 d-inline-flex justify-content-between align-items-center invisible">
        <div className="container m-0">
          <h2 className="display-6"><strong>DropIn Chat</strong></h2>
        </div>
        <div className="d-flex">
          <button className="btn text-light btn-primary h-1 btn-settings"><IoMdSettings size={35} /></button>
        </div>
      </div>

      <div className="header fixed-top bg-primary text-light p-2 d-inline-flex justify-content-between align-items-center">
        <div className="container m-0">
          <h2 className="display-6"><strong>DropIn Chat</strong></h2>
        </div>
        <div className="d-flex">
          <button className="btn text-light btn-primary h-1 btn-settings" onClick={toggleSettings}><IoMdSettings size={35} /></button>
        </div>
      </div>

      {showSettings && (
        <div>
          <div className="settings-bg" onClick={toggleSettings}></div>
          <div className="settings-window">
            <div className="settings-header d-inline-flex justify-content-between align-items-center">
              <h3 className="m-0 p-0">Settings</h3>
              <button className="btn btn-light" onClick={toggleSettings}><IoCloseOutline size={35} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header;
