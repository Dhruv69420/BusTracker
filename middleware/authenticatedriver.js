const jwt = require("jsonwebtoken");
const Driver = require("../model/driverSchema");
const Authenticatedriver = (req, res, next) => {
  const token = req.cookies.jwtoken;
  const verify = jwt.verify(token, process.env.SECRET);

  Driver.findOne({ _id: verify._id, "tokens.token": token })
    .then((verifiedDriver) => {
      if (!verifiedDriver) {
        throw new Error("User not found");
      }
      
      req.verifiedDriver = verifiedDriver;
      next();
    })
    .catch((err) => {
      res.status(401).send("UnauthorizedDriver");
      console.log(err);
    });
};
module.exports = Authenticatedriver;
