import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import "../style.scss";

import Header from "../global/header";
import ChatContent from "./chatcontent";
// home
// login
// chat
// footer


class Chat extends React.Component {
//  componentDidMount() {
//    Startup(process.env.NODE_ENV === "development");
//  }

  render() {
    return (
      <div className="container h-100 main bg-light">
        <Header />
        <ChatContent />
      </div>
    );
  }
}

export default Chat;
