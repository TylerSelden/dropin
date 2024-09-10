import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import "../style.scss";

import { IoMdSettings } from "react-icons/io";

class Header extends React.Component {
  render() {
    return (
      <div className="header blue-bg p-2 d-inline-flex justify-content-between align-items-center">
        <div className="container m-0">
          <h2 className="display-6"><strong>DropIn Chat</strong></h2>
        </div>
        <div className="d-flex">
          <button className="btn h-1"><IoMdSettings size={35} /></button>
        </div>
      </div>
    )
  }
}

export default Header;
