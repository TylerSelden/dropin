import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "../global/header";
import HomeContent from "./homecontent";

const Home = () => {
  return (
    <div className="container h-100 main bg-light text-dark">
      <Header />
      <HomeContent />
    </div>
  );
}

export default Home;
