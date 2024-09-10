import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Message = ({ timestamp, username, text }) => {
  return (
    <p title={timestamp}><strong>{username}:</strong> {text}</p>
  )
}

export default Message;
