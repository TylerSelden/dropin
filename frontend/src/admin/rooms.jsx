import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";


const Rooms = ({ socket, rooms, killFunc }) => {
  const navigate = useNavigate();

  const goToRoom = (code) => {
    socket.onclose = null;
    socket.close();
    navigate("/chat", { state: { code: code, name: "Admin" }})
  }

  return (
    <div className="bg-light row justify-content-center mb-5 overflow-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Name ({rooms.length})</th>
            <th>Messages ({rooms.reduce((acc, obj) => acc + obj.msgnum, 0)})</th>
            <th>Last</th>
            <th>Kill</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={index}>
              <td className="clickable" onClick={() => { goToRoom(room.code) }}>{room.code}</td>
              <td>{room.msgnum}</td>
              <td>{new Date(room.lastmsg.timestamp).toLocaleString()}</td>
              <td className="clickable text-danger" onClick={() => { killFunc(room.code) }}>Kill</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Rooms;
