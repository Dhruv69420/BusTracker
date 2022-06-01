import React, { useState } from "react";
import Navbar from "./Navbar";
import { useHistory } from "react-router-dom";
const SignUp = (props) => {
  const history = useHistory();
  const [user, setUser] = useState({
    name: "",
    route: "",
    email: "",
    password: "",
  });
  let name, value;
  const inputHandler = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const PostData = (e) => {
    e.preventDefault();
    console.log("in post data");
    const { name, route, email, password } = user;
    fetch(`${props.ftch}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        route,
        email,
        password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("registration successful");
          history.push(props.push);
        } else {
          console.log("unsuccessful");
        }
        console.log(response.json);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Navbar icon={props.icon} signin={props.signin} signup={props.signup}></Navbar>
      <div className="container mt-5 signUp">
        <div className="outer-box">
          <div className="inner-box">
            <h2>Sign Up</h2>
            <br />
            <form method="POST">
              <div className="form-group row">
                <div className="col-sm-1">
                  <label htmlFor="exampleInputName">
                    {" "}
                    <i className="zmdi zmdi-account-circle zmdi-hc-2x"></i>
                  </label>
                </div>
                <div className="col-sm-11">
                  <input
                    type="text"
                    name="name"
                    id="exampleInputname"
                    value={user.name}
                    onChange={inputHandler}
                    placeholder="Enter name"
                  />
                </div>
              </div>
              <hr />
              <div className="form-group row">
                <div className="col-sm-1">
                  <label htmlFor="exampleInputRoute">
                    {" "}
                    <i className="zmdi zmdi-bus zmdi-hc-2x"></i>
                  </label>
                </div>
                <div className="col-sm-11">
                  <input
                    type="text"
                    id="exampleInputRoute"
                    name="route"
                    value={user.route}
                    onChange={inputHandler}
                    placeholder="Enter route"
                  />
                </div>
              </div>
              <hr />
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
                    name="email"
                    value={user.email}
                    onChange={inputHandler}
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
                    name="password"
                    value={user.password}
                    onChange={inputHandler}
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <hr />
              <br />
              <button
                type="submit"
                className="btn btn-secondary"
                value="registration"
                onClick={PostData}
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
