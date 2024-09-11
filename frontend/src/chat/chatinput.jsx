import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Message from "./message";

import { IoChevronBackOutline } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";

const ChatInput = () => {
  return (
    <div className="d-flex justify-content-center input-bar fixed-bottom text-danger">
      <button className="btn btn-danger text-light">
        <IoChevronBackOutline size={50}></IoChevronBackOutline>
      </button>
      <input type="text" placeholder="Type a message" />
      <button className="btn btn-success text-light">
        <IoIosSend size={50}></IoIosSend>
      </button>
    </div>
  )
}

export default ChatInput;