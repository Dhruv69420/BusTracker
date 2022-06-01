import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { useHistory } from "react-router-dom";
import currLoc from "../images/currLoc.png";
import marker from "../images/marker.png";
import busicon from "../images/busicon.png";

export default function Student() {
  const history = useHistory();
  const [stop, setStop] = useState({});
  const [currLat, setCurrLat] = useState();
  const [currLong, setCurrLong] = useState();

  const callStudent = async () => {
    try {
      const res = await fetch("/student", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log("in callstud");
      setStop(data);

      if (!res.status === 200) {
        throw new Error(res.error);
      }
    } catch (err) {
      console.log(err);
      history.push("/signin");
    }
  };
  var lockInterval;
  const lock = () => {

    if(document.getElementById("lock").innerHTML == "LockOut"){
      document.getElementById("lock").innerHTML = "LockIn";
      document.getElementById("lock").style.backgroundColor = "yellow";
      document.getElementById("lock").style.color = "black";
      localStorage.setItem("flag2","free");
    }
    else{
      localStorage.setItem("flag2","locked");
      document.getElementById("lock").innerHTML = "LockOut";
      document.getElementById("lock").style.backgroundColor = "green";
      document.getElementById("lock").style.color = "white";
      lockInterval = setInterval(() =>{
        console.log("inside intreval");
        navigator.geolocation.getCurrentPosition((position) => {
          if(localStorage.getItem("flag2") == "free"){
            clearInterval(lockInterval);
          }
          else{   
            //setcurrLat(position.coords.latitude);
            //setcurrLong(position.coords.longitude);
             //if(currLat!=null && currLong!=null){
            
            setViewport({...viewport,latitude:parseFloat(position.coords.latitude),longitude:parseFloat(position.coords.longitude)})
             //console.log(localStorage.getItem("currLat")+" "+localStorage.getItem("currLong"));
             //console.log("coord ");
          }
         });
      }, 5000); 
    }

  }

  const addStop = () => {
    typeof stop != "undefined" && typeof stop.stops != "undefined"
      ? navigator.geolocation.getCurrentPosition((position) => {
          let newcoord = [
            {
              stopLat: position.coords.latitude,
              stopLong: position.coords.longitude,
            },
          ];
          let newstop = stop.stops.concat(newcoord);
          setStop({ ...stop, stops: newstop });
          console.log(stop.stops);
          fetch(`/student/${stop._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(stop),
          })
            .then((response) => {
              if (response.ok) {
                console.log("updation successful");
              } else {
                console.log("updation unsuccessful");
              }
              //console.log(response.json);
            })
            .catch(function (error) {
              console.log(error);
            });
        })
      : console.log("nooo");
  };
  const func = async function () {
    //console.log("loc "+localStorage.getItem("flg"));
    
    if (localStorage.getItem("flag") == 1) clearInterval(myInterval);
    else {
      try {
        navigator.geolocation.getCurrentPosition((position) => {
          setCurrLat(position.coords.latitude);
          setCurrLong(position.coords.longitude);
        });
        //console.log(flag+" * "+myInterval);
        const res = await fetch("/student", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const routedata = await res.json();
        //console.log("in func");
        setStop(routedata);

        if (!res.status === 200) {
          throw new Error(res.error);
        }
      } catch (err) {
        console.log(err);
        history.push("/signin");
      }
    }
  };

  localStorage.setItem("flag", 0);
  var myInterval;
  
  useEffect(() => {
    
    callStudent();
    myInterval = setInterval(func, 5000); 

  }, []);

  const [viewport, setViewport] = useState({
    latitude: 30.686424,
    longitude: 76.855959,
    width: "100vw",
    height: "100vh",
    zoom: 15,
    pitch: 50,
  });
  const clear = function () {
    localStorage.setItem("flag", 1);  
    history.push("/logout");
  };

  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/joemama-69/ckybw6ii82j1v14nus0wtcau6"
        //onLoad={console.log(viewport.longitude+"yo "+viewport.latitude)}
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        <div className="back">
          <button className="btn btn-success btn-lg" onClick={addStop}>
            Add Stop
          </button>

          <button className="btn btn-warning btn-lg" onClick={clear}>
            Log Out
          </button>

          <button className="btn btn-lg" style={{color: "black"},{backgroundColor: "yellow"}} id="lock" onClick={lock}>
            LockIn
          </button>
        </div>
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
                "nomarker"
              ) /*console.log(stop.stops):console.log("nppppp")*/
        }
        {typeof stop != "undefined" && typeof stop.stops != "undefined" ? (
          <Marker
            offsetTop={(-viewport.zoom * 8) / 1.9}
            latitude={parseFloat(stop.busLat)}
            longitude={parseFloat(stop.busLong)}
          >
            <img className="currLoc" id="busicon" src={busicon}></img>
          </Marker>
        ) : (
          console.log("no bus")
        )}
        {typeof currLat != "undefined" && typeof currLong != "undefined" ? (
          <Marker
            offsetTop={(-viewport.zoom * 8) / 1.9}
            latitude={parseFloat(currLat)}
            longitude={parseFloat(currLong)}
          >
            <img className="currLoc" id="curr" src={currLoc}></img>
          </Marker>
        ) : (
          console.log("no curr")
        )}
      </ReactMapGL>
    </div>
  );
}
