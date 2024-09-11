import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "../global/header";
import ChatContent from "./chatcontent";
import ChatInput from "./chatinput";

const Chat = () => {
//  componentDidMount() {
//    Startup(process.env.NODE_ENV === "development");
//  }

  return (
    <div className="main bg-light">
      <Header />
      <ChatContent />
      <ChatInput />
    </div>
  );
}

export default Chat;
