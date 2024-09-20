import React, { useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Message from "./message";

const ChatContent = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="bg-light messages">
      { messages.map((msg, index) => (
        <Message key={index} timestamp={new Date(msg.timestamp).toLocaleString()} username={msg.name} text={msg.text} />
      )) }
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatContent;
