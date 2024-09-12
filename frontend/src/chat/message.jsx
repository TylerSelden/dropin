import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Message = ({ timestamp, username, text }) => {
  return (
    <p title={timestamp} className="mb-3"><strong>{username}:</strong> {text}</p>
  )
}

export default Message;
