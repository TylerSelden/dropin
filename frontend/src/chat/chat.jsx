import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "../global/header";
import ChatContent from "./chatcontent";
import ChatInput from "./chatinput";

const Chat = () => {
  return (
    <div className="main bg-light">
      <Header />
      <ChatContent />
      <ChatInput />
    </div>
  );
}

export default Chat;
