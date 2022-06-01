import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = (props) => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light">
        <NavLink className="navbar-brand" to={"/"}>
          <img src={props.icon} width="25px" height="40px" />
        </NavLink>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <NavLink className="nav-link" to={props.signup/*"/signup"*/}>
                <p>
                  <strong>SignUp</strong>
                </p>
              </NavLink>
            </li>
            <li className="nav-item active">
              <NavLink className="nav-link" to={props.signin/*"/signin"*/}>
                <p>
                  <strong>SignIn</strong>
                </p>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
