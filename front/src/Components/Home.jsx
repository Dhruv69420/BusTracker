import React from "react";
import { Link, NavLink } from "react-router-dom";
import driv from "../images/driv.png";
import stud from "../images/stud.png";
import bus from "../images/bus.png";

export default function Home() {
  return (
    <>
      <div className="container">
        <div className="row bustracker">
          <div className="col sm-4"></div>
          <div className="col sm-4 ">
            <p id="pp">
              <strong>Bus Tracker</strong>
            </p>
          </div>
          <div className="col sm-4"></div>
        </div>
      </div>

      <div className="outerbox">
        <div className="row align-items-center">
          <div className="col-md-6 back">
            <Link to="/dsignup">
              {" "}
              <img className="homeimg" src={driv}></img>{" "}
            </Link>
          </div>
          <div className="col-md-6 back">
            <Link to="/signup">
              {" "}
              <img className="homeimg" src={stud}></img>{" "}
            </Link>
          </div>
        </div>
      </div>
      <div className="container back">
        <img src={bus} />
      </div>
    </>
  );
}
