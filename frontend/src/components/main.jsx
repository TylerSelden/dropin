import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
//import "../style.scss";

import Header from "./header";
import Home from "./home";
// home
// login
// chat
// footer


class Main extends React.Component {
//  componentDidMount() {
//    Startup(process.env.NODE_ENV === "development");
//  }

  render() {
    return (
      <div className="container h-100 main white-bg">
        <Header />
        <Home />
      </div>
    );
  }
}

export default Main;
