import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

import { IoChevronBackOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";

const ChatInput = ({ send }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const goToHome = () => {
    navigate("/");
  }

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const sendMessage = () => {
    inputRef.current.focus();
    if (inputValue.trim() === "") return;
    send("msg", inputValue, null, null);
    setInputValue("");
  }

  const handleInput = (evt) => {
    if (evt.key === "Enter") sendMessage();
  }

  return (
    <div className="d-flex justify-content-center input-bar fixed-bottom text-danger">
      <button className="btn btn-danger text-light-force" onClick={ goToHome }>
        <IoChevronBackOutline size={50}></IoChevronBackOutline>
      </button>
      <input value={inputValue} className="text-dark-force" type="text" placeholder="Type a message" onChange={(evt) => setInputValue(evt.target.value)} onKeyDown={handleInput} ref={inputRef} />
      <button className="btn btn-success text-light-force" onClick={sendMessage}>
        <IoIosSend size={50}></IoIosSend>
      </button>
    </div>
  )
}

export default ChatInput;
