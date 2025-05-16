import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import { getLocalValue, setLocalValue } from "../utils/settings.js";

import Footer from "../global/footer";

const HomeContent = () => {
  const navigate = useNavigate();

  const codeRef = useRef(null);
  const nameRef = useRef(null);

  const [codes, setCodes] = useState([]);
  const [codeIndex, setCodeIndex] = useState(0);

  useEffect(() => {
    var _codes = getLocalValue("codes");
    if (_codes) {
      setCodes(_codes);
      setCodeIndex(_codes.length - 1)
      codeRef.current.value = _codes[_codes.length - 1];
    }
    if (getLocalValue("name")) nameRef.current.value = getLocalValue("name");
  }, []);

  const goToChat = () => {
    const code = codeRef.current.value;
    const name = nameRef.current.value;
    if (code.trim() === "" || name.trim() === "") return alert("Inputs cannot be blank.");
    if (name.trim().length < 3 || name.trim().length > 20) return alert("Username must be between 3 and 20 characters long.");
    if (!(new RegExp("^[a-zA-Z0-9!@#$%^&*()\\-_=+{}|\\\\[\\]<>?,./]{3,20}$")).test(name.trim())) return alert("Username contains invalid characters.");

    setLocalValue("name", name);
    // prevent dupes
    if (codes[codes.length - 1] !== code) setLocalValue("codes", [...codes, code]);
    navigate("chat", { state: { code, name }});
  }

  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") goToChat();
    if (evt.target !== codeRef.current) return;

    if (evt.key === "ArrowUp") {
      if (codeIndex === 0) return;
      codeRef.current.value = codes[codeIndex - 1];
      setCodeIndex(codeIndex - 1);
    }
    if (evt.key === "ArrowDown") {
      if (codeIndex === codes.length) return;
      if (codeIndex === codes.length - 1) {
        codeRef.current.value = "";
      } else {
        codeRef.current.value = codes[codeIndex + 1];
      }
      setCodeIndex(codeIndex + 1);
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
              <input className="font-monospace text-dark-force" type="text" ref={codeRef} onKeyDown={handleKeyDown} />
              
              <label>Username:</label>
              <input className="font-monospace text-dark-force" type="text" ref={nameRef} onKeyDown={handleKeyDown} />
            </div>

            <button className="btn btn-primary text-light-force mt-5 p-2 w-50 fw-semibold" onClick={goToChat}>Join</button>
          </div>
        </div>

        <div className="window d-flex justify-content-center">
          <div className="p-4">
            <h4 className="m-5 mt-0">What's new?</h4>

            <div className="text-start announcements">
              <h5>Non-persistent rooms:</h5>
              <p>Users are now able to create non-persistent chat rooms, where messages only appear to users currently in the chat, and not when users join the room. Simply add a '!' to the beginning of the room code to create one.</p>
              <h5>Timestamps:</h5>
              <p>DropIn now supports timestamps, in your local time. Simply hover your cursor over a message for it to appear.</p>
              <h5>Code Memory:</h5>
              <p>DropIn will now remember not just your most recent room code, but all of them! All you need to do is use the up/down arrow keys in the Room Code textbox to cycle through them.</p>
              <h5>New Themes:</h5>
              <p>DropIn is introducing themes, such as light/dark mode, and a brand-new colorblind mode for accessibility purposes. More are on the way.</p>
              <h5>Sleek UI:</h5>
              <p>After completely refactoring the code, DropIn v2 has a new, sleek design.</p>
            </div>
          </div>
        </div>


        <div className="window d-flex justify-content-center">
          <div className="p-4">
            <h4 className="m-5 mt-0">Announcements</h4>

            <div className="text-start announcements">
              <h5>5/16/25:</h5>
              <p>After a <i>very</i> long outage, DropIn is finally back! The issue was very difficult to pin down, but it's one that won't happen again. Apologies for the outage, and welcome back!</p>
              <h5>2/28/25:</h5>
              <p>Non-persistent chat rooms are now available, allowing users to securely send private messages to one another, without worry of the message being saved and shown to other users later on. To create one, add a '!' to the beginning of the room code.</p>
              <h5>1/31/25:</h5>
              <p>A new password setting is now available! This allows you to pre-set a password for any reserved usernames you have.</p>
              <h5>10/29/24:</h5>
              <p>The inactivity period for a room to be automatically deleted has been raised from 7 to 14 days.</p>
              <h5>10/15/24:</h5>
              <p>Usernames are now required to be between 3 and 20 characters long, and now contain restrictions on some special characters.</p>
              <h5>10/8/24:</h5>
              <p>There was a brief outage earlier this morning, due to an SSL certificate expiring. This issue has been resolved, and DropIn has been restored to full functionality.</p>
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
