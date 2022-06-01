const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

dotenv.config({ path: "./config.env" });
require("./db/conn");
app.use(express.json());
app.use(require("./router/auth"));
const PORT = process.env.PORT || 3000;
//const User= require('./model/userSchema');

//app.get('/student',middleware, (req,res)=>{
//    res.send('rider');
//});
app.get("/driver", (req, res) => {
  res.send("driver");
});
app.get("/login", (req, res) => {
  res.send("login");
});
app.get("/register", (req, res) => {
  res.send("register");
});

if(process.env.NODE_ENV == "production"){
  app.use(express.static("front/build"));
}

app.listen(PORT, () => {
  console.log("Server is running at PORT " + PORT);
});
