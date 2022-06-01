import React, { useState } from "react";
import Navbar from "./Navbar";
import { useHistory } from "react-router-dom";

const SignIn = (props) => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = (e) => {
    e.preventDefault();
    console.log("in loginUser");
    fetch(`${props.ftch}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("login successful");
          history.push(props.compo);
        } else {
          console.log("login unsuccessful");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div>
      <Navbar signin={props.signin} signup={props.signup} icon={props.icon}></Navbar>
      <div className="container mt-5 signUp">
        <div className="outer-box">
          <div className="inner-box">
            <h2>Sign In</h2>
            <br />
            <form method="POST">
              <div className="form-group row">
                <div className="col-sm-1">
                  <label htmlFor="exampleInputEmail">
                    {" "}
                    <i className="zmdi zmdi-email zmdi-hc-2x"></i>
                  </label>
                </div>
                <div className="col-sm-11">
                  <input
                    type="email"
                    id="exampleInputEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <hr />
              <div className="form-group row">
                <div className="col-sm-1">
                  <label htmlFor="exampleInputPassword">
                    {" "}
                    <i className="zmdi zmdi-lock zmdi-hc-2x"></i>
                  </label>
                </div>
                <div className="col-sm-11">
                  <input
                    type="password"
                    id="exampleInputpassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <hr />
              <br />
              <button
                type="submit"
                className="btn btn-secondary"
                onClick={loginUser}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
