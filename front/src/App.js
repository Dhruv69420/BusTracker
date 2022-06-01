import "./App.css";
import Home from "./Components/Home";
import Driver from "./Components/Driver";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import Student from "./Components/Student";
import Logout from "./Components/logout";
import stud from "./images/stud.png";
import driv from "./images/driv.png";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/signin"><SignIn icon={stud} ftch="/login" signin="/signin" signup="/signup" compo="/student"/></Route>
          <Route exact path="/signup"><SignUp icon={stud} ftch="/register" signin="/signin" signup="/signup" push="/signin"/></Route>
          <Route exact path="/dsignin"><SignIn icon={driv} ftch="/dlogin" signin="/dsignin" signup="/dsignup" compo="/driver"/></Route>
          <Route exact path="/dsignup"><SignUp icon={driv} ftch="/dregister" signin="/dsignin" signup="/dsignup" push="/dsignin"/></Route>
          <Route exact path="/student" component={Student} />
          <Route exact path="/driver" component={Driver} />
          <Route exact path="/logout"><Logout ftch="/logout" psh="/signin" ret="logout"/></Route>
          <Route exact path="/dlogout"><Logout ftch="/dlogout" psh="/dsignin" ret="dlogout"/></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
