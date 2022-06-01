const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authenticatedriver = require("../middleware/authenticatedriver");
require("../db/conn");
const User = require("../model/userSchema");
const Route = require("../model/routeSchema");
const Driver = require("../model/driverSchema");
router.get("/", (req, res) => {
  res.send("Router Server created");
});
let route;
router.post("/student", (req, res) => {
  const { routeNumber, busLat, busLong, stops } = req.body;
  if (!routeNumber || !busLat || !busLong || !stops) {
    return res.status(422).json({ error: "error in student" });
  }

  route = new Route({ routeNumber, busLat, busLong, stops });

  route
    .save()
    .then(() => {
      res.status(200).json({ message: req.body });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

router.post("/dregister", (req, res) => {
  const { name, email, route, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({ error: "error" });
  }
  Driver.findOne({ email: email })
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({ error: "Email already exists" });
      }

      const driver = new Driver({ name, email, route, password });

      driver
        .save()
        .then(() => {
          res.status(201).json({ message: "user registration successful" });
        })
        .catch((err) => res.status(500).json({ error: err }));
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/dlogin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "plz fill the data" });
  }

  Driver.findOne({ email: email })
    .then((userLogin) => {
      if (!userLogin) {
        res.status(400).json({ error: "user error1" });
      } else {
        const isMatch = bcrypt.compareSync(password, userLogin.password);
        const token = userLogin.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
        });

        if (!isMatch) {
          res.status(400).json({ error: "invalid login credentials" });
        } else {
          res.json({ message: "login successful2" });
        }
      }
    })
    .catch((err) => console.log(err));
});
router.post("/register", (req, res) => {
  const { name, email, route, password } = req.body;

  if (!name || !email || !route || !password) {
    return res.status(422).json({ error: "error" });
  }
  User.findOne({ email: email })
    .then((userExists) => {
      if (userExists) {
        return res.status(422).json({ error: "Email already exists" });
      }

      const user = new User({ name, email, route, password });

      user
        .save()
        .then(() => {
          res.status(201).json({ message: "user registration successful" });
        })
        .catch((err) => res.status(500).json({ error: err }));
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "plz fill the data" });
  }

  User.findOne({ email: email })
    .then((userLogin) => {
      if (!userLogin) {
        res.status(400).json({ error: "user error" });
      } else {
        const isMatch = bcrypt.compareSync(password, userLogin.password);
        const token = userLogin.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 3600000),
          httpOnly: true,
        });

        if (!isMatch) {
          res.status(400).json({ error: "invalid login credentials" });
        } else {
          res.json({ message: "login successful" });
        }
      }
    })
    .catch((err) =>{
      console.log(`login unsuccessful due to error:${err}`);
    });
});

router.get("/student", authenticate, (req, res) => {
  console.log("mes");
  res.send(req.verifiedRoute);
});
router.get("/driver", authenticatedriver, (req, res) => {
  //console.log(req.verifiedDriver);
  res.send(req.verifiedDriver);
});
router.put("/route/:id", (req, res) => {
 // console.log(req.body);
  
  Route.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
      res.json({ error: "this is route error" });
    } else {
      //console.log(post);
      post.busLat = req.body.busLat;
      post.busLong = req.body.busLong;
      post
        .save()
        .then((response) => {
          console.log("route updated");
          res.status(200).json("route updated");
        })
        .catch((err) => console.log(err));
    }
  });
});
router.put(`/driverr/:id`, (req, res) => {
  //console.log(req.body);
  Driver.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
      res.json({ error: "this is the error" });
    } else {
      // console.log(post);
      post.route = req.body.route;
      post
        .save()
        .then((response) => {
          console.log("updated");
          res.status(200).json("updated");
        })
        .catch((err) => console.log(err));
    }
    
  });
});

router.put(`/student/:id`, (req, res) => {
  //console.log(req.body);

  Route.findById(req.params.id, (err, post) => {
    if (err) {
      console.log(err);
      res.json({ error: "this is th error" });
    } else {
      //console.log("this is post "+post);
      post.stops = req.body.stops;
      post
        .save()
        .then((response) => {
          console.log("stops updated");
          res.status(200).json("stops updated");
        })
        .catch((err) => console.log(err));
    }
  });
});
router.get("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("Logged Out");
});
module.exports = router;
