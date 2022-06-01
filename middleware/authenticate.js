const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const Route = require("../model/routeSchema");
const Driver = require("../model/driverSchema");
const Authenticate = (req, res, next) => {
  const token = req.cookies.jwtoken;
  const verify = jwt.verify(token, process.env.SECRET);

  User.findOne({ _id: verify._id, "tokens.token": token })
    .then((verifiedUser) => {
      if (!verifiedUser) {
        //throw new Error("user not found");
        Driver.findOne({ _id: verify._id, "tokens.token": token })
          .then((verifiedDriver) => {
            if (!verifiedDriver) {
              throw new Error("Driver not found");
            }
            else {
              Route.findOne({ routeNumber: verifiedDriver.route }).then(
                (verifiedDriverRoute) => {
                  if (!verifiedDriverRoute) {
                    throw new Error("route not found");
                  }
                  req.verifiedRoute = verifiedDriverRoute;
                  next();
                }
              );
            }    
          })
      } else {
        Route.findOne({ routeNumber: verifiedUser.route }).then(
          (verifiedUserRoute) => {
            if (!verifiedUserRoute) {
              throw new Error("route not found");
            }
            req.verifiedRoute = verifiedUserRoute;
            next();
          }
        );
      }
    })
    .catch((err) => {
      res.status(401).send("Unauthorized");
      console.log(err);
    });
};
module.exports = Authenticate;
