import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import Footer from "./footer";

const HomeContent = () => {
  const navigate = useNavigate();

  const goToChat = () => {
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
              <label>Room code:</label>
              <input className="font-monospace text-dark-force" type="text" />
              
              <label>Username:</label>
              <input className="font-monospace text-dark-force" type="text" />
            </div>

            <button className="btn btn-primary text-light-force mt-5 p-2 w-50 fw-semibold" onClick={goToChat}>Join</button>
          </div>
        </div>
        <div className="window d-flex justify-content-center">
          <div className="p-4">
            <h4 className="m-5 mt-0">Announcements</h4>

            <div className="text-start announcements">
              <h5>9/16/24:</h5>
              <p>Okay, I might've been wrong. I've been running into a problem for a few days, but it's finally resolved, so development is moving again. Also, <strong>I've decided to move the release date up to Friday, September 28th.</strong></p>
              <h5>9/12/24:</h5>
              <p>Good news, the frontend development is finished! Now all that's left is scripting, and everything will be good to go. The estimated release date for DropIn is October 2nd.</p>
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
