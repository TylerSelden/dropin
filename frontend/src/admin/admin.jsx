import React, { useState, useEffect }from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import Header from "../global/header";
import AdminContent from "./admincontent";

const Admin = () => {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [adminData, setAdminData] = useState({});
  const [socket, setSocket] = useState(null);
  const [pass, setPass] = useState(null);

  useEffect(() => {
    var _socket = new WebSocket(process.env.REACT_APP_SOCKET_URL);
    setSocket(_socket);

    _socket.onopen = () => {
      var _pass = prompt("Please enter the admin password:");
      setPass(_pass);
    }

    _socket.onmessage = (msg) => {
      msg = JSON.parse(msg.data);

      if (msg.type == "adminmsg") {
        msg.msg.clients = msg.msg.clients.filter(i => i);

        setAdminData(msg.msg);
      } else if (msg.type == "info") {
        alert(msg.msg);
      } else if (msg.type == "newauth") {
        alert(msg.msg);
        socket.onclose = null;
        navigate("/");
      } else {
        alert(msg.msg);
        return window.location.reload();
      }
    }

    _socket.onclose = () => {
      alert("Disconnected from server.");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (!pass) return;
    login();
  }, [pass]);

  useEffect(() => {
    if (Object.keys(adminData).length === 0) return;
    setLoaded(true);
  }, [adminData]);

  const login = () => {
    socket.send(JSON.stringify({ type: "adminjoin", pass }));
  }
  const killUser = (id) => {
    socket.send(JSON.stringify({ type: "admincmd", pass, cmd: "killuser", msg: id }));
  }
  const killRoom = (code) => {
    socket.send(JSON.stringify({ type: "admincmd", pass, cmd: "killroom", msg: code }));
  }
  return (
    <>
      {!loaded ? (
        <div className="loading-container">
          <div className="loading">
            <h2>Loading...</h2>
          </div>
        </div>
      ) : (
        <div className="container h-100 main bg-light text-dark">
          <Header />
          <AdminContent socket={socket} adminData={adminData} killUser={killUser} killRoom={killRoom} />
        </div>
    )}
    </>
  );
}

export default Admin;
