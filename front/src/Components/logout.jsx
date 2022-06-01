import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Logout = (props) => {
  const history = useHistory();
  useEffect(() => {
    fetch(`${props.ftch}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        history.push(props.psh);
        if (res.status != 200) {
          throw new Error(res.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <>{props.ret}</>;
};

export default Logout;
