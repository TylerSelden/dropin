import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";

import Header from "../global/header";
import ChatContent from "./chatcontent";

const Chat = () => {
//  componentDidMount() {
//    Startup(process.env.NODE_ENV === "development");
//  }

  return (
    <div className="main bg-light">
      <Header />
      <ChatContent />
    </div>
  );
}

export default Chat;
