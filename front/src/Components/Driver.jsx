import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { NavLink, useHistory } from "react-router-dom";
import marker from "../images/marker.png";
import busicon from "../images/busicon.png";
export default function Driver() {
  let routedata;
  const history = useHistory();
  const [driverinfo, setDriverInfo] = useState({});
  const [show, setShow] = useState("yes");
  const [stop, setStop] = useState();
  const [currLat, setCurrLat] = useState();
  const [currLong, setCurrLong] = useState();

  const updateRoute = (event) => {
    setDriverInfo({ ...driverinfo, route: event.target.value });
    //console.log(driverinfo);
  };
  const showStops = async () => {
    try {
      const res = await fetch("/student", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      //console.log("in callstud");
      routedata = await res.json();

      setStop(routedata);
      console.log("B4 setting" + stop);
      localStorage.setItem("stop", JSON.stringify(routedata));

      //console.log("interval is set");
      myInterval = setInterval(func, 5000);

      if (!res.status === 200) {
        throw new Error(res.error);
      }
    } catch (err) {
      console.log("no show stops");
      history.push("/dsignin");
    }
  };

  const callDriver = async () => {
    try {
      const res = await fetch("/driver", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      setDriverInfo(data);
      if (!res.status === 200) {
        throw new Error(res.error);
      }
    } catch (err) {
      console.log(err);
      history.push("/dsignin");
    }
  };

  var lockInterval;

  const lock = () => {
    if (document.getElementById("lock").innerHTML == "LockOut") {
      document.getElementById("lock").innerHTML = "LockIn";
      document.getElementById("lock").style.backgroundColor = "yellow";
      document.getElementById("lock").style.color = "black";
      localStorage.setItem("flag3", "free");
    } else {
      localStorage.setItem("flag3", "locked");
      document.getElementById("lock").innerHTML = "LockOut";
      document.getElementById("lock").style.backgroundColor = "green";
      document.getElementById("lock").style.color = "white";
      lockInterval = setInterval(() => {
        console.log("inside intreval");
        navigator.geolocation.getCurrentPosition((position) => {
          if (localStorage.getItem("flag3") == "free") {
            clearInterval(lockInterval);
          } else {
            //setcurrLat(position.coords.latitude);
            //setcurrLong(position.coords.longitude);
            //if(currLat!=null && currLong!=null){

            setViewport({
              ...viewport,
              latitude: parseFloat(position.coords.latitude),
              longitude: parseFloat(position.coords.longitude),
            });
            //console.log(localStorage.getItem("currLat")+" "+localStorage.getItem("currLong"));
            //console.log("coord ");
          }
        });
      }, 5000);
    }
  };

  const func = async function () {
    console.log("inside func");
    if (localStorage.getItem("flag1") == 1) {
      console.log("inside interval");
      clearInterval(myInterval);
      localStorage.setItem("flag1", 0);
    } else {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          setCurrLat(position.coords.latitude);
          setCurrLong(position.coords.longitude);

          localStorage.setItem(
            "stop",
            JSON.stringify({
              ...JSON.parse(localStorage.getItem("stop")),
              busLat: position.coords.latitude,
              busLong: position.coords.longitude,
            })
          );
        });
      } catch (err) {
        console.log(err);
      } finally {
        console.log(stop);
        //console.log(JSON.parse(localStorage.getItem("stop")));
        //console.log(stop._id);
        //console.log("in finally"+ JSON.parse(localStorage.getItem("stop"))._id);
        if (localStorage.getItem("stop") != null) {
          console.log("not null");
          console.log(JSON.parse(localStorage.getItem("stop")));
          fetch(`/route/${JSON.parse(localStorage.getItem("stop"))._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: localStorage.getItem("stop"),
          })
            .then((response) => {
              if (response.ok) {
                console.log("updation of current location successful");
                setShow("no");
              } else {
                console.log("updation of current location unsuccessful");
                //alert("Please enter a valid route number");
              }
              //console.log(response.json);
            })
            .catch(function (error) {
              console.log("there is an erroe " + error);
            });
        }
      }
    }
  };

  //localStorage.setItem("flag1", 0);
  var myInterval;

  useEffect(() => {
    callDriver();
  }, []);

  const PostData = (e) => {
    e.preventDefault();

    fetch(`/driverr/${driverinfo._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(driverinfo),
    })
      .then((response) => {
        if (response.ok) {
          //console.log("updation successful");
          setShow("no");
          showStops();
        } else {
          //console.log("updation unsuccessful");
          alert("Please enter a valid route number");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [viewport, setViewport] = useState({
    latitude: 30.516159943583236,
    longitude: 76.65981062567397,
    width: "100vw",
    height: "100vh",
    zoom: 15,
    pitch: 50,
  });

  const clear = function () {
    localStorage.setItem("flag1", 1);
    history.push("/dlogout");
  };

  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/joemama-69/ckybw6ii82j1v14nus0wtcau6"
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        {show == "yes" ? (
          <form method="PUT">
            <div className="route-box">
              <input
                type="text"
                name="route1"
                id="exampleInputroute"
                className="route-bar"
                onChange={updateRoute}
                placeholder="Enter route"
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
              value="registration"
              onClick={PostData}
            >
              Start Sharing Location
            </button>
            <NavLink to="/dlogout">
              <button className="btn btn-warning" onClick={clear}>
                Log Out
              </button>
            </NavLink>
          </form>
        ) : (
          <>
            <button
              className="btn btn-success"
              value="registration"
              onClick={() => {
                setShow("yes");
                localStorage.setItem("flag1",1);
              }}
            >
              Change Route
            </button>

            <button className="btn" id="lock" style={{color: "black"},{backgroundColor: "yellow"}} onClick={lock}>
              LockIn
            </button>
          </>
        )}
        {
          typeof stop != "undefined" && typeof stop.stops != "undefined"
            ? stop.stops.map((stop) => (
                /*console.log(parseFloat(stop.stopLong))*/ <Marker
                  latitude={parseFloat(stop.stopLat)} //*/30.697721}
                  longitude={parseFloat(stop.stopLong)} //*/76.860699}
                  offsetTop={(-viewport.zoom * 8) / 1.9}
                >
                  <img
                    src={marker}
                    width={viewport.zoom * 5}
                    height={viewport.zoom * 5}
                  ></img>
                </Marker>
              ))
            : console.log(
                "undef"
              ) /*console.log(stop.stops):console.log("nppppp")*/
        }
        {typeof currLat != "undefined" && typeof currLong != "undefined" ? (
          <Marker
            offsetTop={(-viewport.zoom * 8) / 1.9}
            latitude={currLat}
            longitude={currLong}
          >
            <img className="currLoc" id="curr" src={busicon}></img>
          </Marker>
        ) : (
          console.log("no currBus")
        )}
      </ReactMapGL>
    </div>
  );
}
