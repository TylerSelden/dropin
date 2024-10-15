import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import { getLocalValue, setLocalValue } from "../utils/settings.js";

import Stats from "./stats";
import Clients from "./clients";
import Rooms from "./rooms";
import Footer from "../global/footer";

const HomeContent = ({ socket, adminData, killUser, killRoom }) => {
  return (
    <div>
      <div className="w-100 text-center justify-content-center">
        <h1 className="main-header">Admin Panel</h1>
        <br />
        <p className="sub-header mb-5">Monitor DropIn's chats, users, and other statistics.</p>

        <br />
        <Stats stats={adminData.stats} />

        <br />
        <h3>Users</h3>
        <Clients clients={adminData.clients} killFunc={killUser} />
        <h3>Rooms</h3>
        <Rooms socket={socket} rooms={adminData.rooms} killFunc={killRoom} />
      </div>
      <Footer />
    </div>
  )
}

export default HomeContent;
