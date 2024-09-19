import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import Header from "../global/header";
import ChatContent from "./chatcontent";
import ChatInput from "./chatinput";

const Chat = () => {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(new WebSocket(process.env.REACT_APP_SOCKET_URL));
  
  const send = (type, msg, code, name) => {
    socket.send(JSON.stringify({ type, msg, code, name }));
  }
  socket.onopen = () => {
    send("join", null, "asdf", "admin");
  }
  socket.onmessage = (msg) => {
    msg = JSON.parse(msg.data);
    if (msg.type == "msg") {
      setMessages([...messages, msg.msg]);
    } else if (msg.type == "err") {
      alert(msg.msg);
    } else if (msg.type == "msgs") {
      setMessages(msg.msg);
      setLoaded(true);
    }
  }
  socket.onclose = () => {
    alert("Disconnected from server.");
    navigate("/");
  }

  useEffect(() => {
    return () => {
      socket.onclose = null;
      socket.close();
    }
  }, []);

  return (
    <>
      {!loaded ? (
        <div className="loading-container">
          <div className="loading">
            <h2>Loading...</h2>
          </div>
        </div>
      ) : (
        <div className="main bg-light text-dark">
          <Header />
          <ChatContent messages={messages} />
          <ChatInput send={send} />
        </div>
      )}
    </>
  );
}

export default Chat;
