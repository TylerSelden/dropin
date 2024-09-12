import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import Footer from "./footer";

//class HomeContent extends React.Component {
const HomeContent = () => {
  const navigate = useNavigate();

  function goToChat() {
    if (process.env.NODE_ENV === "development") {
      navigate("chat");
    } else {
      alert("DropIn is not ready quite yet, but hang tight!")
    }
  }

  return (
    <div>
      <div className="w-100 text-center justify-content-center">
        <h1 className="main-header">Secure, Private, Reliable</h1>
        <br />
        <p className="sub-header">DropIn prioritizes simplicity and security over all else.</p>
    
        <div className="window d-flex justify-content-center">
          <div className="p-4">
            <h4 className="m-5 mt-0">Join a room</h4>

            <div className="login-inputs justify-content-center">
              <label htmlFor="code">Room code:</label>
              <input className="font-monospace" type="text" data-name="code" />
              
              <label htmlFor="name">Username:</label>
              <input className="font-monospace" type="text" data-name="name" />
            </div>

            <button className="btn btn-primary text-light mt-5 p-2 w-50 fw-semibold" onClick={goToChat}>Join</button>
          </div>
        </div>
        <div className="window d-flex justify-content-center">
          <div className="p-4">
            <h4 className="m-5 mt-0">Announcements</h4>

            <div className="text-start announcements">
              <h5>9/10/24:</h5>
              <p>Hey everybody! DropIn is currently under some heavy development, so it's not available as of now. However, I'm dedicating more time towards its development, so stay tuned!</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default HomeContent;
