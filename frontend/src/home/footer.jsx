import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer mt-5 pt-5 text-center">
        <div className="container">
          <p className="text-dark m-0">© 2024 DropIn Chat, All Rights Reserved - <span className="text-danger" id="socketStatus">Disconnected from server</span></p>
        </div>
      </footer>
    )
  }
}

export default Footer;
