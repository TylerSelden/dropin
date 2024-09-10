import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Message from "./message";

const ChatInput = () => {
  return (
    <div className="bg-light">
      <div className="messages">
        <Message timestamp="10:00:00" username="Tyler" text="yo" />
      </div>
    </div>
  )
}

export default ChatInput;
