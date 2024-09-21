import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";


const Clients = ({ clients, killFunc }) => {
  const navigate = useNavigate();

  const goToRoom = (client) => {
    navigate("/chat", { state: { code: client.code, name: "Admin" }})
  }

  return (
    <div className="bg-light row justify-content-center mb-5 overflow-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Username ({new Set(clients.map(obj => obj.name)).size})</th>
            <th>Room code ({new Set(clients.map(obj => obj.code)).size})</th>
            <th>Connected time</th>
            <th>Kill</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={index}>
              <td>{client.name}</td>
              <td className="clickable" onClick={() => { goToRoom(client) }}>{client.code}</td>
              <td>{new Date(client.timestamp).toLocaleString()}</td>
              <td className="clickable text-danger" onClick={() => { console.log(client.id); killFunc(client.id) }}>Kill</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Clients;
