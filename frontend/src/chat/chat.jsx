import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";

import Header from "../global/header";
import ChatContent from "./chatcontent";
import ChatInput from "./chatinput";

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loaded, setLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(new WebSocket(process.env.REACT_APP_SOCKET_URL));
  
  const send = (type, msg, code, name, pass) => {
    socket.send(JSON.stringify({ type, msg, code, name, pass }));
  }
  socket.onopen = () => {
    if (!location.state) return navigate("/");
    send("join", null, location.state.code, location.state.name);
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
    } else if (msg.type == "authreq") {
      var _pass = prompt(msg.msg);
      send("join", null, location.state.code, location.state.name, _pass);
    } else {
      alert(msg.msg);
      return window.location.reload();
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
