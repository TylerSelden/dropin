import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.scss";

import Header from "../global/header";
import HomeContent from "./homecontent";

const Home = () => {
//  componentDidMount() {
//    Startup(process.env.NODE_ENV === "development");
//  }

  return (
    <div className="container h-100 main bg-light">
      <Header />
      <HomeContent />
    </div>
  );
}

export default Home;
