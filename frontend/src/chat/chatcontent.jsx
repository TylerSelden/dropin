import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Message from "./message";

const ChatContent = () => {
  const obj = { timestamp: Math.random(), username: "Tyler", text: "alsdfjlsdjdsjfdldldflslfsdsjdsfslsfslsdlakjssdlksjdlfkjdskfjdsjflsdjfldsfjlsdjflsdfjlsdfjldkjflsdjflsdjflsdjflsjflsdfjsdljslkjsdlfjksdflkjsdlfkjsdljsdlfkjsdlfjsdlfkjsdlfjsdlkjsdlkjsdlkjsdlfjdslfjsdlfjsdljsdlfjsdlkjslkjsdlklkdsljdfljfljfljfljfljfs" };
  const dummy = Array(500).fill(null).map(() => ({...obj}))

  return (
    <div className="bg-light">
      <div className="messages">
        { dummy.map((msg, index) => (
          <Message key={index} timestamp={msg.timestamp} username={msg.username} text={msg.text} />
        )) }
      </div>
    </div>
  )
}

export default ChatContent;
