import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Message from "./message";

const ChatContent = ({ messages }) => {
  return (
    <div className="bg-light">
      <div className="messages">
        { messages.map((msg, index) => (
          <Message key={index} timestamp={msg.timestamp} username={msg.name} text={msg.text} />
        )) }
      </div>
    </div>
  )
}

export default ChatContent;
