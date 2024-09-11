import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SettingsMenu from "./settingsmenu";

import { IoMdSettings } from "react-icons/io";

const Header = () => {
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
          <button className="btn text-light btn-primary h-1 btn-settings"><IoMdSettings size={35} /></button>
        </div>
      </div>
    </div>
  )
}

export default Header;
