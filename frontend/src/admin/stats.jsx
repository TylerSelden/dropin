import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";


const Stats = ({ stats }) => {
  return (
    <div className="row justify-content-center mb-5">
      <Stat name="Messages" value={stats.msgs.toLocaleString()} desc="The total number of messages sent on DropIn." />
      <Stat name="Connections" value={stats.connections.toLocaleString()} desc="The total amount of times users joined a room." />
      <Stat name="Rooms" value={stats.rooms.toLocaleString()} desc="The total number of rooms created on DropIn." />
    </div>
  );
}

const Stat = ({ name, desc, value }) => {
  return (
    <div className="col-md-3 col-sm-6 mb-3">
      <div className="card text-center border-primary">
        <div className="card-header bg-primary text-white">
          <h5>{name}</h5>
        </div>
        <div className="card-body">
          <h2 className="card-title">{value}</h2>
          <p className="card-text text-black">{desc}</p>
        </div>
      </div>
    </div>
  )
}

export default Stats;
